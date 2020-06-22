const redis = require('redis');
const { promisify } = require('util');

const logger = require('../log.js');
const db = require('../db');

class CardService {
    constructor(configService) {
        this.redis = redis.createClient(configService.getValue('redisUrl'));

        this.getAsync = promisify(this.redis.get).bind(this.redis);
        this.setAsync = promisify(this.redis.set).bind(this.redis);
    }

    async replaceCards(cards) {
        try {
            await db.query('DELETE FROM "CardLocaleNames"');
            await db.query('DELETE FROM "Cards"');
        } catch (err) {
            logger.error('Failed to delete existing cards', err);

            return;
        }

        let expansions;
        try {
            expansions = await db.query('SELECT * FROM "Expansions"');
        } catch (err) {
            logger.error('Failed to fetch expansions', err);

            return;
        }

        let houses;
        try {
            houses = await db.query('SELECT * FROM "Houses"');
        } catch (err) {
            logger.error('Failed to fetch expansions', err);

            return;
        }

        const expansionsByNumber = {};

        for (const expansion of expansions) {
            expansionsByNumber[expansion.ExpansionId] = {
                id: expansion.Id,
                expansionId: expansion.ExpansionId,
                code: expansion.Code,
                name: expansion.Name
            };
        }

        const housesByCode = {};

        for (const house of houses) {
            housesByCode[house.Code] = {
                id: house.Id,
                code: house.Code,
                name: house.Name
            };
        }

        let cardsById = {};
        for (let card of cards) {
            try {
                const expansion = expansionsByNumber[card.expansion];

                if (!expansion) {
                    logger.error(`Failed to find expansion for card ${card.id}`);

                    continue;
                }

                const house = housesByCode[card.house];
                if (!house) {
                    logger.error(`Failed to find house for card ${card.id}`);

                    continue;
                }

                let ret = await db.query(
                    'INSERT INTO "Cards" ("CardId", "Name", "Number", "Image", "Keywords", "Traits", "HouseId", "ExpansionId", "Type", "Rarity", "Amber", "Armor", "Power", "Text")' +
                        ' VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING "Id"',
                    [
                        card.id,
                        card.name,
                        card.number,
                        card.image,
                        card.keywords.join(','),
                        card.traits.join(','),
                        house.id,
                        expansion.id,
                        card.type,
                        card.rarity,
                        card.amber,
                        card.armor,
                        card.power,
                        card.text
                    ]
                );

                for (const [language, locale] of Object.entries(card.locale)) {
                    await db.query(
                        'INSERT INTO "CardLocaleNames" ("CardId", "Locale", "Name") VALUES ($1, $2, $3)',
                        [ret[0].Id, language, locale.name]
                    );
                }
            } catch (err) {
                logger.error(`Failed to add card ${card.id}`, err);

                continue;
            }

            cardsById[card.id] = card;
        }

        await this.setAsync('cards', JSON.stringify(cardsById));
    }

    async getAllCards(options) {
        if (this.cardCache) {
            return this.cardCache;
        }

        let redisCards = await this.getAsync('cards');
        if (redisCards) {
            logger.info('Found cached cards in redis');

            this.cardCache = JSON.parse(redisCards);

            return this.cardCache;
        }

        let cards;

        try {
            cards = await db.query(
                'SELECT c.*, e."ExpansionId", e."Code" AS "ExpansionCode", h."Code" AS "House" FROM "Cards" c ' +
                    'JOIN "Expansions" e ON e."Id" = c."ExpansionId" JOIN "Houses" h ON h."Id" = c."HouseId"',
                []
            );
        } catch (err) {
            logger.error('Failed to lookup cards', err);

            return [];
        }

        let retCards = {};

        for (let card of cards) {
            let languages = [];
            try {
                languages = await db.query('SELECT * FROM "CardLocaleNames" WHERE "CardId" = $1', [
                    card.Id
                ]);
            } catch (err) {
                logger.error(`Failed to get languages for card ${card.CardId}`, err);
            }

            retCards[card.CardId] = this.mapCard(card, languages, options);
        }

        logger.info('Cards loaded from database, sending to redis');
        await this.setAsync('cards', JSON.stringify(retCards));
        this.cardCache = retCards;

        return retCards;
    }

    mapCard(card, languages, options) {
        let retCard = {
            id: card.CardId,
            name: card.Name,
            type: card.Type,
            house: card.House,
            rarity: card.Rarity,
            number: card.Number,
            image: card.Image,
            amber: card.Amber,
            traits: card.Traits.split(','),
            locale: {}
        };

        for (let language of languages) {
            retCard.locale[language.Locale] = { name: language.Name };
        }

        if (options && options.shortForm) {
            return retCard;
        }

        retCard.armor = card.Armor;
        retCard.power = card.Power;
        retCard.keywords = card.Keywords.split(',');
        retCard.expansion = card.ExpansionId;
        retCard.packCode = card.ExpansionCode;

        return retCard;
    }
}

module.exports = CardService;
