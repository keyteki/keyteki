const logger = require('../log');
const util = require('../util');
const db = require('../db');
const { expand, flatten } = require('../Array');
const Constants = require('../constants');
const BonusOrder = Constants.Houses.concat(['amber', 'capture', 'damage', 'draw', 'discard']);

class DeckService {
    constructor(configService, cardService) {
        this.configService = configService;
        this.cardService = cardService;
        this.houseCache = {};
    }

    async getHouseIdFromName(house) {
        if (this.houseCache[house]) {
            return this.houseCache[house];
        }

        let houses;
        try {
            houses = await db.query('SELECT "Id", "Code" FROM "Houses"', []);
        } catch (err) {
            logger.error('Failed to retrieve houses', err);

            return undefined;
        }

        if (!houses || houses.length == 0) {
            logger.error('Could not find any houses');

            return undefined;
        }

        for (let house of houses) {
            this.houseCache[house.Code] = house.Id;
        }

        return this.houseCache[house];
    }

    async getByUuid(id) {
        let deck;

        try {
            deck = await db.query(
                'SELECT d.*, u."Username", e."ExpansionId" as "Expansion"' +
                    'FROM "Decks" d ' +
                    'JOIN "Users" u ON u."Id" = "UserId" ' +
                    'JOIN "Expansions" e on e."Id" = d."ExpansionId" ' +
                    'WHERE d."Uuid" = $1',
                [id]
            );
        } catch (err) {
            logger.error(`Failed to retrieve deck: ${id}`, err);

            throw new Error('Unable to fetch deck: ' + id);
        }

        if (!deck || deck.length === 0) {
            logger.warn(`Failed to retrieve deck: ${id} as it was not found`);

            return undefined;
        }

        let retDeck = this.mapDeck(deck[0]);

        await this.getDeckCardsAndHouses(retDeck);

        return retDeck;
    }

    async getById(id) {
        let deck;

        try {
            deck = await db.query(
                'SELECT d.*, u."Username", e."ExpansionId" as "Expansion", (SELECT COUNT(*) FROM "Decks" WHERE "Name" = d."Name") AS DeckCount, ' +
                    '(SELECT COUNT(*) FROM "Games" g JOIN "GamePlayers" gp ON gp."GameId" = g."Id" WHERE g."WinnerId" = $1 AND gp."DeckId" = d."Id") AS "WinCount", ' +
                    '(SELECT COUNT(*) FROM "Games" g JOIN "GamePlayers" gp ON gp."GameId" = g."Id" WHERE g."WinnerId" != $1 AND g."WinnerId" IS NOT NULL AND gp."PlayerId" = $1 AND gp."DeckId" = d."Id") AS "LoseCount" ' +
                    'FROM "Decks" d ' +
                    'JOIN "Users" u ON u."Id" = "UserId" ' +
                    'JOIN "Expansions" e on e."Id" = d."ExpansionId" ' +
                    'WHERE d."Id" = $1 ',
                [id]
            );
        } catch (err) {
            logger.error(`Failed to retrieve deck: ${id}`, err);

            throw new Error('Unable to fetch deck: ' + id);
        }

        if (!deck || deck.length === 0) {
            logger.warn(`Failed to retrieve deck: ${id} as it was not found`);

            return undefined;
        }

        let retDeck = this.mapDeck(deck[0]);

        await this.getDeckCardsAndHouses(retDeck);

        // Add tags to the deck
        retDeck.tags = await this.getDeckTags(retDeck.id, deck[0].UserId);

        return retDeck;
    }

    async deckExistsForUser(user, deckId) {
        let deck;
        try {
            deck = await db.query(
                'SELECT 1 FROM "Decks" d WHERE d."Identity" = $1 AND d."UserId" = $2',
                [deckId, user.id]
            );
        } catch (err) {
            logger.error(`Failed to check deck: ${deckId}`, err);

            return false;
        }

        return deck && deck.length > 0;
    }

    async getStandaloneDeckById(standaloneId) {
        let deck;

        try {
            deck = await db.query(
                'SELECT d.*, e."ExpansionId" as "Expansion" ' +
                    'FROM "StandaloneDecks" d ' +
                    'JOIN "Expansions" e on e."Id" = d."ExpansionId" ' +
                    'WHERE d."Id" = $1 ',
                [standaloneId]
            );
        } catch (err) {
            logger.error(`Failed to retrieve deck: ${standaloneId}`, err);

            throw new Error('Unable to fetch deck: ' + standaloneId);
        }

        if (!deck || deck.length === 0) {
            logger.warn(`Failed to retrieve deck: ${standaloneId} as it was not found`);

            return undefined;
        }

        let retDeck = this.mapDeck(deck[0]);

        await this.getDeckCardsAndHouses(retDeck, true);

        return retDeck;
    }

    async getStandaloneDecks() {
        let decks;

        try {
            decks = await db.query(
                'SELECT d.*, e."ExpansionId" as "Expansion" ' +
                    'FROM "StandaloneDecks" d ' +
                    'JOIN "Expansions" e on e."Id" = d."ExpansionId"'
            );
        } catch (err) {
            logger.error('Failed to retrieve standalone decks', err);

            throw new Error('Unable to fetch standalone decks');
        }

        if (!decks || decks.length === 0) {
            logger.warn('Failed to retrieve standalone decks, none found');

            return undefined;
        }

        let retDecks = [];
        for (const deck of decks) {
            let retDeck = this.mapDeck(deck);

            retDeck.verified = true;

            await this.getDeckCardsAndHouses(retDeck, true);

            retDecks.push(retDeck);
        }

        return retDecks;
    }

    async createStandalone(deck) {
        return this.insertDeck(deck);
    }

    async getSealedDeck(expansions) {
        let dbExpansions = [];

        if (expansions.aoa) {
            dbExpansions.push(435);
        }

        if (expansions.cota) {
            dbExpansions.push(341);
        }

        if (expansions.wc) {
            dbExpansions.push(452);
        }

        if (expansions.mm) {
            dbExpansions.push(479);
        }

        if (expansions.dt) {
            dbExpansions.push(496);
        }

        if (expansions.woe) {
            dbExpansions.push(600);
        }

        if (expansions.gr) {
            dbExpansions.push(700);
        }

        if (expansions.as) {
            dbExpansions.push(800);
        }

        let deck;
        let expansionStr = dbExpansions.join(',');
        try {
            deck = await db.query(
                `SELECT d.*, e."ExpansionId" AS "Expansion" from "Decks" d JOIN "Expansions" e on e."Id" = d."ExpansionId" WHERE d."ExpansionId" IN (SELECT "Id" FROM "Expansions" WHERE "ExpansionId" IN(${expansionStr})) AND "IncludeInSealed" = True ORDER BY random() LIMIT 1`
            );
        } catch (err) {
            logger.error('Failed to fetch random deck', err);
            throw new Error('Failed to fetch random deck');
        }

        if (!deck || deck.length === 0) {
            logger.warn('Could not find any sealed decks!');
            return undefined;
        }

        let retDeck = this.mapDeck(deck[0]);

        await this.getDeckCardsAndHouses(retDeck);

        return retDeck;
    }

    async getNumDecksForUser(user, options) {
        let ret;
        let params = [user.id];
        let index = 2;
        const filter = this.processFilter(index, params, options.filter);

        try {
            ret = await db.query(
                'SELECT COUNT(*) AS "NumDecks" FROM "Decks" d JOIN "Expansions" e ON e."Id" = d."ExpansionId" WHERE "UserId" = $1 ' +
                    filter,
                params
            );
        } catch (err) {
            logger.error('Failed to count users decks');

            throw new Error('Failed to count decks');
        }

        return ret && ret.length > 0 ? ret[0].NumDecks : 0;
    }

    mapColumn(column, isSort = false) {
        switch (column) {
            case 'lastUpdated':
                return '"LastUpdated"';
            case 'name':
                return isSort ? 'lower("Name")' : 'lower(d."Name")';
            case 'expansion':
                return isSort ? '"Expansion"' : 'e."ExpansionId"';
            case 'winRate':
                return '"WinRate"';
            case 'isAlliance':
                return '"IsAlliance"';
            default:
                return '"LastUpdated"';
        }
    }

    processFilter(index, params, filterOptions) {
        let filter = '';

        for (let filterObject of filterOptions || []) {
            if (filterObject.name === 'expansion') {
                filter += `AND ${this.mapColumn(filterObject.name)} IN ${expand(
                    1,
                    filterObject.value.length,
                    index
                )} `;
                params.push(...filterObject.value.map((v) => v.value));
                index += filterObject.value.length;
            } else if (filterObject.name === 'tags') {
                if (filterObject.value && filterObject.value.length > 0) {
                    filter += `AND d."Id" IN (
                        SELECT DISTINCT dt."DeckId" 
                        FROM "DeckTags" dt 
                        WHERE dt."TagId" IN ${expand(1, filterObject.value.length, index)}
                    ) `;
                    params.push(...filterObject.value.map((v) => v.value));
                    index += filterObject.value.length;
                }
            } else if (filterObject.name === 'isAlliance') {
                filter += `AND ${this.mapColumn(filterObject.name)} = $${index++} `;
                params.push(filterObject.value);
            } else {
                filter += `AND ${this.mapColumn(filterObject.name)} LIKE $${index++} `;
                params.push(`%${filterObject.value}%`);
            }
        }

        return filter;
    }

    async findForUser(
        user,
        options = { page: 1, pageSize: 10, sort: 'lastUpdated', sortDir: 'desc', filter: [] }
    ) {
        let retDecks = [];
        let decks;
        let pageSize = options.pageSize;
        let page = options.page;
        let sortColumn = this.mapColumn(options.sort, true);
        let sortDir = options.sortDir === 'desc' ? 'DESC' : 'ASC';
        let params = [user.id, pageSize, (page - 1) * pageSize];

        let index = 4;
        const filter = this.processFilter(index, params, options.filter);

        try {
            decks = await db.query(
                'SELECT *, CASE WHEN "WinCount" + "LoseCount" = 0 THEN 0 ELSE (CAST("WinCount" AS FLOAT) / ("WinCount" + "LoseCount")) * 100 END AS "WinRate" FROM ( ' +
                    'SELECT d.*, u."Username", e."ExpansionId" as "Expansion", (SELECT COUNT(*) FROM "Decks" WHERE "Name" = d."Name") AS DeckCount, ' +
                    '(SELECT COUNT(*) FROM "Games" g JOIN "GamePlayers" gp ON gp."GameId" = g."Id" WHERE g."WinnerId" = $1 AND gp."DeckId" = d."Id") AS "WinCount", ' +
                    '(SELECT COUNT(*) FROM "Games" g JOIN "GamePlayers" gp ON gp."GameId" = g."Id" WHERE g."WinnerId" != $1 AND g."WinnerId" IS NOT NULL AND gp."PlayerId" = $1 AND gp."DeckId" = d."Id") AS "LoseCount" ' +
                    'FROM "Decks" d ' +
                    'JOIN "Users" u ON u."Id" = "UserId" ' +
                    'JOIN "Expansions" e on e."Id" = d."ExpansionId" ' +
                    'WHERE "UserId" = $1 ' +
                    filter +
                    ') sq ' +
                    `ORDER BY ${sortColumn} ${sortDir} ` +
                    'LIMIT $2 ' +
                    'OFFSET $3',
                params
            );
        } catch (err) {
            logger.error('Failed to retrieve decks', err);
        }

        for (let deck of decks) {
            let retDeck = this.mapDeck(deck);

            await this.getDeckCardsAndHouses(retDeck);

            retDecks.push(retDeck);
        }

        // Add tags to all decks
        await this.addTagsToDecks(retDecks, user.id);

        return retDecks;
    }

    async getDeckCardsAndHouses(deck, standalone = false) {
        let cardTableQuery;

        if (standalone) {
            cardTableQuery = 'SELECT * FROM "StandaloneDeckCards" WHERE "DeckId" = $1';
        } else {
            cardTableQuery =
                'SELECT dc.*, h."Code" as "House" FROM "DeckCards" dc LEFT JOIN "Houses" h ON h."Id" = dc."HouseId" WHERE "DeckId" = $1';
        }

        let cards = await db.query(cardTableQuery, [deck.id]);

        // These are cards that have changed houses in later sets.
        let specialCardDefaultHouses = {
            'armageddon-cloak': 'sanctum',
            'avenging-aura': 'sanctum',
            'book-of-malefaction': 'sanctum',
            'eye-of-judgment': 'sanctum',
            'hymn-to-duma': 'sanctum',
            'johnny-longfingers': 'shadows',
            'lord-golgotha': 'sanctum',
            'mantle-of-the-zealot': 'sanctum',
            'martyr-s-end': 'sanctum',
            'master-of-the-grey': 'sanctum',
            'mighty-lance': 'sanctum',
            'one-stood-against-many': 'sanctum',
            'rogue-ogre': 'brobnar',
            'the-promised-blade': 'sanctum',
            'champion-tabris': 'sanctum',
            'dark-centurion': 'saurian',
            'first-or-last': 'sanctum',
            francus: 'sanctum',
            'glorious-few': 'sanctum',
            'gorm-of-omm': 'sanctum',
            'grey-abbess': 'sanctum',
            'professor-terato': 'logos',
            'scrivener-favian': 'sanctum',
            'bordan-the-redeemed': 'sanctum',
            'bull-wark': 'sanctum',
            'burning-glare': 'sanctum',
            'citizen-shrix': 'saurian',
            retribution: 'sanctum',
            'shifting-battlefield': 'sanctum',
            snarette: 'dis',
            'subtle-otto': 'shadows',
            'even-ivan': 'logos',
            'odd-clawde': 'logos',
            'sacro-alien': 'staralliance',
            'sacro-beast': 'untamed',
            'sacro-bot': 'logos',
            'sacro-fiend': 'dis',
            'sacro-saurus': 'saurian',
            'sacro-thief': 'shadows',
            corrode: 'unfathomable',
            'purifier-of-souls': 'sanctum',
            stampede: 'untamed',
            'follow-the-leader': 'brobnar',
            picaroon: 'dis',
            'research-smoko': 'logos',
            'vault-s-blessing': 'untamed'
        };

        deck.cards = cards.map((card) => ({
            dbId: card.Id,
            id: card.CardId,
            count: card.Count,
            maverick: card.Maverick || undefined,
            anomaly: card.Anomaly || undefined,
            image: card.ImageUrl || undefined,
            house: card.House || specialCardDefaultHouses[card.CardId] || undefined,
            isNonDeck: card.IsNonDeck,
            prophecyId: card.ProphecyId || undefined,
            enhancements: card.Enhancements
                ? card.Enhancements.replace(/[[{}"\]]/gi, '')
                      .split(',')
                      .filter((c) => c.length > 0)
                      .sort((a, b) => BonusOrder.indexOf(a) - BonusOrder.indexOf(b))
                : undefined
        }));

        // Sort cards: prophecy cards by ProphecyId first, then by dbId, others maintain original order
        deck.cards.sort((a, b) => {
            // Put deck cards first.
            if (!a.isNonDeck && b.isNonDeck) {
                return -1;
            }
            if (a.isNonDeck && !b.isNonDeck) {
                return 1;
            }

            // If both have ProphecyId, sort by ProphecyId first, then by dbId
            if (a.prophecyId && b.prophecyId) {
                if (a.prophecyId !== b.prophecyId) {
                    return a.prophecyId - b.prophecyId;
                }
                return a.dbId - b.dbId;
            }
            // If neither has ProphecyId, maintain original order by dbId
            return a.dbId - b.dbId;
        });

        let houseTable = standalone ? 'StandaloneDeckHouses' : 'DeckHouses';
        let houses = await db.query(
            `SELECT * FROM "${houseTable}" dh JOIN "Houses" h ON h."Id" = dh."HouseId" WHERE "DeckId" = $1`,
            [deck.id]
        );
        deck.houses = houses.map((house) => house.Code);

        deck.isStandalone = standalone;
    }

    async create(user, deck) {
        let deckResponse;

        try {
            let response = await util.httpRequest(
                `https://www.keyforgegame.com/api/decks/${deck.uuid}/?links=cards`
            );

            if (response[0] === '<') {
                logger.error('Deck failed to import: %s %s', deck.uuid, response);

                throw new Error('Invalid response from Api. Please try again later.');
            }

            deckResponse = JSON.parse(response);
        } catch (error) {
            logger.error(`Unable to import deck ${deck.uuid}`, error);

            throw new Error('Invalid response from Api. Please try again later.');
        }

        if (!deckResponse || !deckResponse._linked || !deckResponse.data) {
            throw new Error('Invalid response from Api. Please try again later.');
        }

        let newDeck = await this.parseDeckResponse(deck.username, deckResponse);
        if (!newDeck) {
            throw new Error('There was a problem importing your deck, please try again later.');
        }

        let validExpansion = await this.checkValidDeckExpansion(newDeck);
        if (!validExpansion) {
            throw new Error('This deck is from a future expansion and not currently supported');
        }

        let deckExists = await this.deckExistsForUser(user, newDeck.identity);
        if (deckExists) {
            throw new Error('Deck already exists.');
        }

        newDeck.isAlliance = false;

        let response = await this.insertDeck(newDeck, user);

        return this.getById(response.id);
    }

    async createAlliance(user, deck) {
        let deckIds = deck.pods.map((p) => p.split(':')[0]);
        let deckPromises = deckIds.map((d) => this.getByUuid(d));
        let decksByUuid = {};
        let cardsById;

        let allCardsById = await this.cardService.getAllCards();
        let expansionId;

        for (let dbDeck of await Promise.all(deckPromises)) {
            if (!expansionId) {
                expansionId = dbDeck.expansion;
            } else if (expansionId != dbDeck.expansion) {
                throw new Error(
                    'Failed to create Deck. Only Alliance from the same expansion is allowed'
                );
            }
            if (!cardsById) {
                cardsById = await this.cardService.getCardsForExpansionById(
                    undefined,
                    dbDeck.expansion
                );
                deck.expansion = dbDeck.expansion;
            }

            decksByUuid[dbDeck.uuid] = dbDeck;
        }

        deck.houses = [];

        let podCards = [];
        let prophecyCards = [];

        // First pass: collect all prophecy cards from all decks
        for (let pod of deck.pods) {
            let [deckId] = pod.split(':');
            let dbDeck = decksByUuid[deckId];

            for (let card of dbDeck.cards) {
                // Check if this is a prophecy card (either by card type or by having a prophecyId)
                if ((card.card && card.card.type === 'prophecy') || card.prophecyId) {
                    prophecyCards.push({
                        ...card,
                        sourceDeckId: deckId,
                        sourceDeck: dbDeck
                    });
                }
            }
        }

        // Handle prophecy card selection
        if (prophecyCards.length > 0) {
            if (!deck.prophecySourceDeck) {
                throw new Error(
                    'Prophecy source deck must be specified when creating an alliance with prophecy cards'
                );
            }

            // Only include prophecy cards from the selected source deck
            let sourceDeck = decksByUuid[deck.prophecySourceDeck];
            if (!sourceDeck) {
                throw new Error('Invalid prophecy source deck specified');
            }

            let sourceProphecyCards = sourceDeck.cards.filter(
                (card) => (card.card && card.card.type === 'prophecy') || card.prophecyId
            );

            // Add prophecy cards with their original prophecy IDs
            for (let card of sourceProphecyCards) {
                podCards.push({
                    ...card,
                    prophecyId: card.prophecyId // explicitly preserve
                });
            }
        }

        // Second pass: collect regular cards from selected houses
        const tokenDecksAdded = new Set();
        for (let pod of deck.pods) {
            let [deckId, house] = pod.split(':');

            let dbDeck = decksByUuid[deckId];

            deck.houses.push(house);
            for (let card of dbDeck.cards) {
                // Skip prophecy cards as they're handled separately
                if ((card.card && card.card.type === 'prophecy') || card.prophecyId) {
                    continue;
                }
                // Skip archon power cards
                if (card.card && card.card.type === 'archon power') {
                    continue;
                }

                // Only add the token card from a given deck once
                if (card.id === deck.tokenCard?.id) {
                    if (!tokenDecksAdded.has(deckId)) {
                        podCards.push(card);
                        tokenDecksAdded.add(deckId);
                    }
                } else if (card.isNonDeck) {
                    continue;
                } else if (
                    card.maverick === house ||
                    card.anomaly === house ||
                    card.house === house
                ) {
                    podCards.push(card);
                } else if (!card.maverick && !card.anomaly && !card.house) {
                    if (cardsById[card.id] && cardsById[card.id].house === house) {
                        podCards.push(card);
                    } else if (allCardsById[card.id].house === house) {
                        podCards.push(card);
                    }
                }
            }
        }

        deck.lastUpdated = new Date();
        deck.identity = deck.name;
        deck.cards = podCards;

        deck.isAlliance = true;

        return this.insertDeck(deck, user);
    }

    async checkValidDeckExpansion(deck) {
        let ret;
        try {
            ret = await db.query('SELECT 1 FROM "Expansions" WHERE "ExpansionId" = $1', [
                deck.expansion
            ]);
        } catch (err) {
            logger.error('Failed to check expansion', err, deck.expansion, deck.uuid);

            return false;
        }

        return ret && ret.length > 0;
    }

    async insertDeck(deck, user) {
        let ret;

        try {
            await db.query('BEGIN');

            if (user) {
                ret = await db.query(
                    'INSERT INTO "Decks" ("UserId", "Uuid", "Identity", "Name", "IncludeInSealed", "LastUpdated", "Verified", "ExpansionId", "Flagged", "Banned", "IsAlliance") ' +
                        'VALUES ($1, $2, $3, $4, $5, $6, false, (SELECT "Id" FROM "Expansions" WHERE "ExpansionId" = $7), false, false, $8) RETURNING "Id"',
                    [
                        user.id,
                        deck.uuid,
                        deck.identity,
                        deck.name,
                        false,
                        deck.lastUpdated,
                        deck.expansion,
                        deck.isAlliance
                    ]
                );
            } else {
                ret = await db.query(
                    'INSERT INTO "StandaloneDecks" ("Identity", "Name", "LastUpdated", "ExpansionId") ' +
                        'VALUES ($1, $2, $3, (SELECT "Id" FROM "Expansions" WHERE "ExpansionId" = $4)) RETURNING "Id"',
                    [deck.identity, deck.name, deck.lastUpdated || new Date(), deck.expansion]
                );
            }
        } catch (err) {
            logger.error('Failed to add deck', err);

            await db.query('ROLLBACK');

            throw new Error('Failed to import deck');
        }

        deck.id = ret[0].Id;

        let params = [];
        for (let card of deck.cards) {
            params.push(card.id);
            params.push(card.count);
            params.push(card.maverick);
            params.push(card.anomaly);
            if (user) {
                params.push(card.image);
                params.push(await this.getHouseIdFromName(card.house));
                params.push(card.enhancements ? JSON.stringify(card.enhancements) : undefined);
                params.push(card.isNonDeck);
                params.push(card.prophecyId); // Add prophecy ID
            }

            params.push(deck.id);
            if (!user) {
                params.push(card.enhancements);
            }
        }

        try {
            if (user) {
                await db.query(
                    `INSERT INTO "DeckCards" ("CardId", "Count", "Maverick", "Anomaly", "ImageUrl", "HouseId", "Enhancements", "IsNonDeck", "ProphecyId", "DeckId") VALUES ${expand(
                        deck.cards.length,
                        10
                    )}`,
                    params
                );
            } else {
                await db.query(
                    `INSERT INTO "StandaloneDeckCards" ("CardId", "Count", "Maverick", "Anomaly", "DeckId", "Enhancements") VALUES ${expand(
                        deck.cards.length,
                        6
                    )}`,
                    params
                );
            }
        } catch (err) {
            logger.error('Failed to add deck', err);

            await db.query('ROLLBACK');

            throw new Error('Failed to import deck');
        }

        let deckHouseTable = user ? '"DeckHouses"' : '"StandaloneDeckHouses"';
        try {
            await db.query(
                `INSERT INTO ${deckHouseTable} ("DeckId", "HouseId") VALUES ($1, (SELECT "Id" FROM "Houses" WHERE "Code" = $2)), ` +
                    '($1, (SELECT "Id" FROM "Houses" WHERE "Code" = $3)), ($1, (SELECT "Id" FROM "Houses" WHERE "Code" = $4))',
                flatten([deck.id, deck.houses])
            );

            await db.query('COMMIT');
        } catch (err) {
            logger.error('Failed to add deck', err);

            await db.query('ROLLBACK');

            throw new Error('Failed to import deck');
        }

        return deck;
    }

    async update(deck) {
        if (deck.verified) {
            try {
                await db.query(
                    'UPDATE "Decks" SET "Verified" = true, "LastUpdated" = $2 WHERE "Id" = $1',
                    [deck.id, new Date()]
                );
            } catch (err) {
                logger.error('Failed to update deck', err);

                throw new Error('Failed to update deck');
            }
        }

        for (let card of deck.cards) {
            if (card.enhancements) {
                try {
                    await db.query('UPDATE "DeckCards" SET "Enhancements" = $2 WHERE "Id" = $1', [
                        card.dbId,
                        card.enhancements
                    ]);
                } catch (err) {
                    logger.error('Failed to update deck enhancements', err);

                    throw new Error('Failed to update deck');
                }
            }
        }
    }

    async updateProphecyAssignments(deckId, assignments) {
        try {
            for (let [cardDbId, prophecyId] of Object.entries(assignments)) {
                await db.query('UPDATE "DeckCards" SET "ProphecyId" = $2 WHERE "Id" = $1', [
                    cardDbId,
                    prophecyId
                ]);
            }
        } catch (err) {
            logger.error('Failed to update prophecy assignments', err);
            throw new Error('Failed to update prophecy assignments');
        }
    }

    async delete(id) {
        try {
            await db.query('DELETE FROM "Decks" WHERE "Id" = $1', [id]);
        } catch (err) {
            logger.error('Failed to delete deck', err);

            throw new Error('Failed to delete deck');
        }
    }

    async getFlaggedUnverifiedDecksForUser(user) {
        let retDecks = [];
        let decks;

        try {
            decks = await db.query(
                'SELECT d.*, u."Username", e."ExpansionId" as "Expansion", (SELECT COUNT(*) FROM "Decks" WHERE "Name" = d."Name") AS "DeckCount", ' +
                    '(SELECT COUNT(*) FROM "Games" g JOIN "GamePlayers" gp ON gp."GameId" = g."Id" WHERE g."WinnerId" = $1 AND gp."DeckId" = d."Id") AS "WinCount", ' +
                    '(SELECT COUNT(*) FROM "Games" g JOIN "GamePlayers" gp ON gp."GameId" = g."Id" WHERE g."WinnerId" != $1 AND g."WinnerId" IS NOT NULL AND gp."PlayerId" = $1 AND gp."DeckId" = d."Id") AS "LoseCount" ' +
                    'FROM "Decks" d ' +
                    'JOIN "Users" u ON u."Id" = "UserId" ' +
                    'JOIN "Expansions" e on e."Id" = d."ExpansionId" ' +
                    'WHERE u."Id" = $1 AND d."Verified" = False AND (SELECT COUNT(*) FROM "Decks" WHERE "Name" = d."Name") > $2',
                [user.id, this.configService.getValueForSection('lobby', 'lowerDeckThreshold')]
            );
        } catch (err) {
            logger.error(`Failed to retrieve unverified decks: ${user.id}`, err);

            throw new Error(`Unable to fetch unverified decks: ${user.id}`);
        }

        for (let deck of decks) {
            let retDeck = this.mapDeck(deck);

            await this.getDeckCardsAndHouses(deck);

            retDecks.push(retDeck);
        }

        return retDecks;
    }

    async verifyDecksForUser(user) {
        try {
            await db.query(
                'UPDATE "Decks" SET "Verified" = True WHERE "UserId" = $1 AND "Verified" = False',
                [user.id]
            );
        } catch (err) {
            logger.error(`Failed to verify decks: ${user.id}`, err);

            throw new Error(`Unable to unverify decks: ${user.id}`);
        }
    }

    async parseDeckResponse(username, deckResponse) {
        const allCards = await this.cardService.getAllCards();

        let specialCards = {
            479: { 'dark-æmber-vault': true, 'it-s-coming': true },
            855: {
                'armageddon-cloak': true,
                'avenging-aura': true,
                'book-of-malefaction': true,
                'eye-of-judgment': true,
                'hymn-to-duma': true,
                'johnny-longfingers': true,
                'lord-golgotha': true,
                'mantle-of-the-zealot': true,
                'martyr-s-end': true,
                'master-of-the-grey': true,
                'mighty-lance': true,
                'one-stood-against-many': true,
                'rogue-ogre': true,
                'the-promised-blade': true,
                'champion-tabris': true,
                'dark-centurion': true,
                'first-or-last': true,
                francus: true,
                'glorious-few': true,
                'gorm-of-omm': true,
                'grey-abbess': true,
                'professor-terato': true,
                'scrivener-favian': true,
                'bordan-the-redeemed': true,
                'bull-wark': true,
                'burning-glare': true,
                'citizen-shrix': true,
                retribution: true,
                'shifting-battlefield': true,
                snarette: true,
                'subtle-otto': true,
                'even-ivan': true,
                'odd-clawde': true,
                'sacro-alien': true,
                'sacro-beast': true,
                'sacro-bot': true,
                'sacro-fiend': true,
                'sacro-saurus': true,
                'sacro-thief': true
            },
            874: {
                'dark-æmber-vault': true,
                'build-your-champion': true,
                'digging-up-the-monster': true,
                'tomes-gigantic': true
            },
            886: {
                'avenging-aura': true,
                corrode: true,
                'lord-golgotha': true,
                'one-stood-against-many': true,
                'purifier-of-souls': true,
                stampede: true,
                'dark-centurion': true,
                'follow-the-leader': true,
                picaroon: true,
                'research-smoko': true,
                'vault-s-blessing': true,
                'citizen-shrix': true,
                'even-ivan': true,
                'odd-clawde': true
            }
        };

        let anomalies = {
            'ecto-charge': { anomalySet: 600, house: 'geistoid' },
            'near-future-lens': { anomalySet: 600, house: 'staralliance' },
            'orb-of-wonder': { anomalySet: 453, house: 'sanctum' },
            'the-grim-reaper': { anomalySet: 453, house: 'geistoid' },
            'the-red-baron': { anomalySet: 453, house: 'skyborn' },
            valoocanth: { anomalySet: 453, house: 'unfathomable' }
        };

        let deckCards = deckResponse._linked.cards;

        let enhancementsByCardId = {};

        if (deckResponse.data.bonus_icons) {
            for (let icon of deckResponse.data.bonus_icons) {
                if (!enhancementsByCardId[icon.card_id]) {
                    enhancementsByCardId[icon.card_id] = [];
                }

                enhancementsByCardId[icon.card_id].push(icon.bonus_icons);
            }
        }

        let cards = deckCards.map((card) => {
            let id = card.card_title
                .toLowerCase()
                .replace(/[,?.!"„""“”]/gi, '')
                .replace(/[ ''’]/gi, '-');

            if (card.rarity === 'Evil Twin') {
                id += '-evil-twin';
            }

            let retCard;
            let count = deckResponse.data._links.cards.filter((uuid) => uuid === card.id).length;
            if (card.is_maverick) {
                retCard = {
                    id: id,
                    count: count,
                    maverick: card.house.replace(' ', '').toLowerCase()
                };
            } else if (card.is_anomaly) {
                retCard = {
                    id: id,
                    count: count,
                    anomaly: card.house.replace(' ', '').toLowerCase()
                };
            } else {
                retCard = {
                    id: id,
                    count: count
                };
            }

            if (card.is_enhanced) {
                retCard.enhancements = [];
                retCard.uuid = card.id;
            }

            if (
                card.card_type === 'Creature2' ||
                (card.card_text === '' &&
                    card.power === null &&
                    card.card_type === 'Creature' &&
                    card.rarity === 'Rare') ||
                card.card_type === 'Gigantic Creature Art'
            ) {
                retCard.id += '2';
            }

            // Revenants can be in any house, their real house is set on the deck itself
            if (card.house.toLowerCase().replace(' ', '') !== allCards[retCard.id].house) {
                retCard.house = card.house.toLowerCase().replace(' ', '');
            }

            // If this is one of the cards that has an entry for every house, get the correct house image
            if (specialCards[card.expansion] && specialCards[card.expansion][id]) {
                retCard.house = card.house.toLowerCase().replace(' ', '');
                retCard.image = `${retCard.id}-${retCard.house}`;
            }

            if (anomalies[id] && anomalies[id].anomalySet !== card.expansion) {
                // anomaly cards' real house
                retCard.house = anomalies[id].house;
                retCard.image = `${retCard.id}-${retCard.house}`;
            }

            retCard.isNonDeck = card.is_non_deck;

            return retCard;
        });

        let toAdd = [];
        for (let card of cards) {
            if (card.enhancements) {
                for (let i = 0; i < card.count - 1; i++) {
                    let cardToAdd = Object.assign({}, card);

                    cardToAdd.enhancements = enhancementsByCardId[card.uuid][i + 1];

                    cardToAdd.count = 1;
                    toAdd.push(cardToAdd);
                }

                card.enhancements = enhancementsByCardId[card.uuid][0];
                card.count = 1;
            }
        }

        cards = cards.concat(toAdd);

        let uuid = deckResponse.data.id;
        let anyIllegalCards = cards.find(
            (card) =>
                !card.id
                    .split('')
                    .every((char) =>
                        'æaăàáãǎâbcdeĕèéěfghĭìíǐijklmnoöǑŏòóõǒpqrstuŭùúǔvwxyz0123456789-[]*…'.includes(
                            char
                        )
                    )
        );
        if (anyIllegalCards) {
            logger.error(`DECK IMPORT ERROR: ${anyIllegalCards.id}`);

            return undefined;
        }

        return {
            expansion: deckResponse.data.expansion,
            username: username,
            uuid: uuid,
            identity: deckResponse.data.name
                .toLowerCase()
                .replace(/[,?.!"„""]/gi, '')
                .replace(/[ '']/gi, '-'),
            cardback: '',
            name: deckResponse.data.name,
            houses: deckResponse.data._links.houses.map((house) =>
                house.replace(' ', '').toLowerCase()
            ),
            cards: cards,
            lastUpdated: new Date()
        };
    }

    mapDeck(deck) {
        return {
            expansion: deck.Expansion,
            id: deck.Id,
            identity: deck.Identity,
            isAlliance: !!deck.IsAlliance,
            name: deck.Name,
            lastUpdated: deck.LastUpdated,
            losses: deck.LoseCount,
            usageCount: deck.DeckCount,
            username: deck.Username,
            uuid: deck.Uuid,
            verified: deck.Verified,
            wins: deck.WinCount,
            winRate: deck.WinRate,
            tags: [] // Tags will be populated separately
        };
    }

    async getDeckTags(deckId, userId) {
        try {
            const tags = await db.query(
                'SELECT t."Id" as id, t."Name" as name, t."Color" as color ' +
                    'FROM "Tags" t ' +
                    'JOIN "DeckTags" dt ON dt."TagId" = t."Id" ' +
                    'WHERE dt."DeckId" = $1 AND t."UserId" = $2 ' +
                    'ORDER BY t."Name" ASC',
                [deckId, userId]
            );
            return tags || [];
        } catch (err) {
            logger.error('Failed to get deck tags', err);
            return [];
        }
    }

    async addTagsToDecks(decks, userId) {
        for (let deck of decks) {
            deck.tags = await this.getDeckTags(deck.id, userId);
        }
        return decks;
    }
}

module.exports = DeckService;
