const logger = require('../log.js');
const db = require('../db');
const RedisClientFactory = require('./RedisClientFactory');
const { expand, flatten } = require('../Array');

// Keeps each bulk insert well under postgres' limit of 65535 parameters
const InsertChunkSize = 1000;

function splitList(value) {
    return value ? value.split(',') : [];
}

function* chunks(array, size) {
    for (let i = 0; i < array.length; i += size) {
        yield array.slice(i, i + size);
    }
}

class CardService {
    constructor(configService) {
        this.configService = configService;
        const factory = new RedisClientFactory(configService);
        this.redis = factory.createClient();

        this.redis.connect();

        this.cardExpansionCache = {};
    }

    /**
     * Replaces all card data in the database with the given cards and refreshes the redis cache.
     * Runs in a single transaction so a failed import leaves the existing data untouched.
     * @param {any[]} cards
     */
    async replaceCards(cards) {
        let expansions;
        let houses;
        try {
            expansions = await db.query('SELECT * FROM "Expansions"');
            houses = await db.query('SELECT * FROM "Houses"');
        } catch (err) {
            logger.error('Failed to fetch expansions and houses', err);

            return;
        }

        const expansionsByNumber = {};
        for (const expansion of expansions) {
            expansionsByNumber[expansion.ExpansionId] = expansion.Id;
        }

        const housesByCode = {};
        for (const house of houses) {
            housesByCode[house.Code] = house.Id;
        }

        const rows = [];
        const rowKeys = new Set();
        const skipped = {};
        for (const card of cards) {
            const expansionId = expansionsByNumber[card.expansion];
            const houseId = housesByCode[card.house];
            if (!expansionId || !houseId) {
                const reason = !expansionId
                    ? `unknown expansion ${card.expansion}`
                    : `unknown house ${card.house}`;
                skipped[reason] = (skipped[reason] || 0) + 1;

                continue;
            }

            // Cards printed in several houses share an id within an expansion, but only one
            // row per id and expansion can be stored
            const key = `${card.id}|${expansionId}`;
            if (rowKeys.has(key)) {
                continue;
            }

            rowKeys.add(key);
            rows.push({ card, expansionId, houseId });
        }

        for (const [reason, count] of Object.entries(skipped)) {
            logger.warn(`Skipped ${count} cards with ${reason}`);
        }

        try {
            await db.transaction(async (client) => {
                await db.queryTran(client, 'DELETE FROM "CardLocaleNames"');
                await db.queryTran(client, 'DELETE FROM "Cards"');

                const localeRows = [];
                for (const chunk of chunks(rows, InsertChunkSize)) {
                    const params = flatten(
                        chunk.map(({ card, expansionId, houseId }) => [
                            card.id,
                            card.name,
                            card.number,
                            card.image,
                            card.keywords.join(','),
                            card.traits.join(','),
                            houseId,
                            expansionId,
                            card.type,
                            card.rarity,
                            card.amber,
                            card.armor,
                            card.power,
                            card.text
                        ])
                    );

                    const inserted = await db.queryTran(
                        client,
                        'INSERT INTO "Cards" ("CardId", "Name", "Number", "Image", "Keywords", "Traits", "HouseId", "ExpansionId", "Type", "Rarity", "Amber", "Armor", "Power", "Text") ' +
                            `VALUES ${expand(
                                chunk.length,
                                14
                            )} RETURNING "Id", "CardId", "ExpansionId"`,
                        params
                    );

                    const idsByKey = {};
                    for (const row of inserted) {
                        idsByKey[`${row.CardId}|${row.ExpansionId}`] = row.Id;
                    }

                    for (const { card, expansionId } of chunk) {
                        const dbId = idsByKey[`${card.id}|${expansionId}`];
                        for (const [language, locale] of Object.entries(card.locale || {})) {
                            localeRows.push([dbId, language, locale.name]);
                        }
                    }
                }

                for (const chunk of chunks(localeRows, InsertChunkSize)) {
                    await db.queryTran(
                        client,
                        `INSERT INTO "CardLocaleNames" ("CardId", "Locale", "Name") VALUES ${expand(
                            chunk.length,
                            3
                        )}`,
                        flatten(chunk)
                    );
                }
            });
        } catch (err) {
            logger.error('Failed to replace cards', err);

            return;
        }

        // Build the cache from the database so it has the same shape as a cold load
        const cardsById = await this.loadCards();
        this.cardCache = cardsById;

        await this.redis.set('cards', JSON.stringify(cardsById));

        const expansionKeys = await this.redis.keys('cards:*');
        if (expansionKeys.length > 0) {
            await this.redis.del(expansionKeys);
        }

        await this.redis.publish('carddata:updated', '');
    }

    async getAllCards(options) {
        if (this.cardCache) {
            return this.cardCache;
        }

        let redisCards = await this.redis.get('cards');
        if (redisCards) {
            logger.info('Found cached cards in redis');

            this.cardCache = JSON.parse(redisCards);

            return this.cardCache;
        }

        let retCards;
        try {
            retCards = await this.loadCards(options);
        } catch (err) {
            logger.error('Failed to lookup cards', err);

            return [];
        }

        logger.info('Cards loaded from database, sending to redis');
        await this.redis.set('cards', JSON.stringify(retCards));
        this.cardCache = retCards;

        return retCards;
    }

    async getCardsForExpansionById(options, expansionId) {
        if (this.cardExpansionCache[expansionId]) {
            return this.cardExpansionCache[expansionId];
        }

        let redisCards = await this.redis.get(`cards:${expansionId}`);
        if (redisCards) {
            logger.info(`Found cached cards for ${expansionId} in redis`);

            this.cardExpansionCache[expansionId] = JSON.parse(redisCards);

            return this.cardExpansionCache[expansionId];
        }

        let retCards;
        try {
            retCards = await this.loadCards(options, expansionId);
        } catch (err) {
            logger.error('Failed to lookup cards', err);

            return [];
        }

        logger.info('Cards loaded from database, sending to redis');
        await this.redis.set(`cards:${expansionId}`, JSON.stringify(retCards));
        this.cardExpansionCache[expansionId] = retCards;

        return retCards;
    }

    /**
     * Loads cards, optionally for a single expansion, keyed by card id. Where a card has been
     * printed in several expansions the one with the highest expansion id wins, with locales merged.
     * @param {any} options
     * @param {number} [expansionId]
     */
    async loadCards(options, expansionId) {
        const filter = expansionId ? 'WHERE e."ExpansionId" = $1' : '';
        const params = expansionId ? [expansionId] : [];

        const cards = await db.query(
            'SELECT c.*, e."ExpansionId", e."Code" AS "ExpansionCode", h."Code" AS "House" FROM "Cards" c ' +
                `JOIN "Expansions" e ON e."Id" = c."ExpansionId" JOIN "Houses" h ON h."Id" = c."HouseId" ${filter} ` +
                'ORDER BY e."ExpansionId", c."Id"',
            params
        );

        const locales = await db.query(
            'SELECT l."CardId", l."Locale", l."Name" FROM "CardLocaleNames" l ' +
                `JOIN "Cards" c ON c."Id" = l."CardId" JOIN "Expansions" e ON e."Id" = c."ExpansionId" ${filter}`,
            params
        );

        const localesByCard = {};
        for (const locale of locales) {
            (localesByCard[locale.CardId] = localesByCard[locale.CardId] || []).push(locale);
        }

        const retCards = {};
        for (const card of cards) {
            retCards[card.CardId] = this.mapCard(
                card,
                localesByCard[card.Id] || [],
                options,
                retCards[card.CardId] ? retCards[card.CardId].locale : {}
            );
        }

        return retCards;
    }

    clearCache() {
        this.cardCache = null;
        this.cardExpansionCache = {};
    }

    subscribeToUpdates(callback) {
        const factory = new RedisClientFactory(this.configService);
        this.subscriber = factory.createClient();
        this.subscriber.connect().then(() => {
            return this.subscriber.subscribe('carddata:updated', callback);
        });
    }

    async shutdown() {
        await this.redis.close();
        if (this.subscriber) {
            await this.subscriber.close();
        }
    }

    mapCard(card, languages, options, locale) {
        let retCard = {
            id: card.CardId,
            name: card.Name,
            type: card.Type,
            house: card.House,
            rarity: card.Rarity,
            number: card.Number,
            image: card.Image,
            amber: card.Amber,
            traits: splitList(card.Traits),
            locale: locale
        };

        for (let language of languages) {
            retCard.locale[language.Locale] = { name: language.Name };
        }

        if (options && options.shortForm) {
            return retCard;
        }

        retCard.armor = card.Armor;
        retCard.armorTotal = card.Armor;
        retCard.power = card.Power;
        retCard.text = card.Text;
        retCard.keywords = splitList(card.Keywords);
        retCard.expansion = card.ExpansionId;
        retCard.packCode = card.ExpansionCode;

        return retCard;
    }
}

module.exports = CardService;
