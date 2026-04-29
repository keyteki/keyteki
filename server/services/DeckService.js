const logger = require('../log');
const util = require('../util');
const db = require('../db');
const { expand, flatten } = require('../Array');
const Constants = require('../constants');
const BonusOrder = Constants.Houses.concat(['amber', 'capture', 'damage', 'draw', 'discard']);

const allianceRestrictedRules = {
    befuddle: { expansions: [600] },
    ghostform: { expansions: [452, 600] },
    'heart-of-the-forest': { expansions: [435] },
    infurnace: { expansions: [452, 479, 874] },
    jervi: { expansions: [700] },
    'key-abduction': { expansions: [341, 435, 609, 700], maxQuantity: 1 },
    'legionary-trainer': { expansions: [600] },
    reiteration: { expansions: [886] },
    'strategic-feint': { expansions: [886] },
    'united-action': { expansions: [452, 496] },
    'winds-of-death': { expansions: [600, 609] }
};

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

    async getByUuidForUser(id, userId) {
        let deck;

        try {
            deck = await db.query(
                'SELECT d.*, u."Username", e."ExpansionId" as "Expansion"' +
                    'FROM "Decks" d ' +
                    'JOIN "Users" u ON u."Id" = "UserId" ' +
                    'JOIN "Expansions" e on e."Id" = d."ExpansionId" ' +
                    'WHERE d."Uuid" = $1 AND d."UserId" = $2',
                [id, userId]
            );
        } catch (err) {
            logger.error(`Failed to retrieve deck: ${id} for user: ${userId}`, err);

            throw new Error('Unable to fetch deck: ' + id);
        }

        if (!deck || deck.length === 0) {
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

        if (expansions.toc) {
            dbExpansions.push(855);
        }

        if (expansions.momu) {
            dbExpansions.push(874);
        }

        if (expansions.disc) {
            dbExpansions.push(907);
        }

        if (expansions.vm2023) {
            dbExpansions.push(609);
        }

        if (expansions.vm2024) {
            dbExpansions.push(737);
        }

        if (expansions.vm2025) {
            dbExpansions.push(939);
        }

        if (expansions.pv) {
            dbExpansions.push(886);
        }

        if (expansions.cc) {
            dbExpansions.push(918);
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

    async getNumDecksForUser(
        user,
        options = { page: 1, pageSize: 10, sort: 'lastUpdated', sortDir: 'desc', filter: [] }
    ) {
        let ret;
        let params = [user.id];
        let index = 2;
        const filter = this.processFilter(index, params, options?.filter);

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
        if (typeof filterOptions === 'string') {
            try {
                filterOptions = JSON.parse(filterOptions);
            } catch (error) {
                filterOptions = [];
            }
        }
        let filter = '';

        for (let filterObject of filterOptions || []) {
            if (filterObject.name === 'expansion') {
                if (!filterObject.value) {
                    continue;
                }
                if (filterObject.value.length === 0) {
                    filter += 'AND 1 = 0 ';
                    continue;
                }
                filter += `AND ${this.mapColumn(filterObject.name)} IN ${expand(
                    1,
                    filterObject.value.length,
                    index
                )} `;
                params.push(
                    ...filterObject.value.map((v) =>
                        typeof v === 'object' && v !== null ? v.value : v
                    )
                );
                index += filterObject.value.length;
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

        if (!standalone) {
            let accolades = await db.query(
                'SELECT * FROM "DeckAccolades" WHERE "DeckId" = $1 ORDER BY "Id"',
                [deck.id]
            );
            deck.accolades = accolades.map((a) => ({
                id: a.AccoladeId,
                name: a.Name,
                image: a.ImageUrl,
                shown: a.Shown
            }));
        }

        deck.isStandalone = standalone;
    }

    async create(user, deck) {
        let deckResponse;

        try {
            let response = await util.httpRequest(
                `https://www.keyforgegame.com/api/decks/${deck.uuid}/?links=cards`,
                { allowedHosts: ['www.keyforgegame.com'] }
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
            return {
                success: false,
                message: 'This deck is from a future expansion and not currently supported'
            };
        }

        let deckExists = await this.deckExistsForUser(user, newDeck.identity);
        if (deckExists) {
            return {
                success: false,
                message: 'Deck already exists.'
            };
        }

        newDeck.isAlliance = false;

        let response = await this.insertDeck(newDeck, user);

        return {
            success: true,
            deck: await this.getById(response.id)
        };
    }

    async createAlliance(user, deck) {
        if (!Array.isArray(deck.pods) || deck.pods.length !== 3) {
            throw new Error('Alliance decks must be built from exactly 3 house pods');
        }

        const parsedPods = deck.pods.map((pod) => {
            const [deckId, house] = typeof pod === 'string' ? pod.split(':') : [];
            return {
                deckId,
                house
            };
        });

        if (parsedPods.some((pod) => !pod.deckId || !pod.house)) {
            throw new Error('Each pod must be in the format deckUuid:house');
        }

        const uniqueHouses = new Set(parsedPods.map((pod) => pod.house));
        if (uniqueHouses.size !== 3) {
            throw new Error('Alliance decks must use 3 different houses');
        }

        const deckIds = parsedPods.map((pod) => pod.deckId);
        const uniqueDeckIds = Array.from(new Set(deckIds));
        const ownedDeckPromises = uniqueDeckIds.map((deckId) =>
            this.getByUuidForUser(deckId, user.id)
        );
        const decksByUuid = {};
        let cardsById;
        const allCardsById = await this.cardService.getAllCards();
        let expansionId;

        const ownedDecks = await Promise.all(ownedDeckPromises);
        const missingOwnedDeckIds = [];

        for (let i = 0; i < ownedDecks.length; i++) {
            const dbDeck = ownedDecks[i];
            if (!dbDeck) {
                missingOwnedDeckIds.push(uniqueDeckIds[i]);
                continue;
            }

            if (!expansionId) {
                expansionId = dbDeck.expansion;
            } else if (expansionId !== dbDeck.expansion) {
                throw new Error(
                    'Failed to create deck. Only Alliance from the same expansion is allowed'
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

        if (missingOwnedDeckIds.length > 0) {
            const missingDeckChecks = await Promise.all(
                missingOwnedDeckIds.map((deckId) => this.getByUuid(deckId))
            );

            if (missingDeckChecks.some((dbDeck) => !!dbDeck)) {
                throw new Error('Failed to create deck. You may only use your own decks');
            }

            throw new Error('Failed to create deck. One or more source decks do not exist');
        }

        const expansion = Constants.Expansions.find((candidate) => candidate.id === expansionId);
        const expansionRequiresTide = Boolean(expansion?.tideRequired);
        const expansionRequiresToken = Boolean(expansion?.tokenRequired);
        const expansionSupportsProphecy = Boolean(expansion?.prophecySupported);
        const selectedDeckIds = uniqueDeckIds;

        for (let pod of parsedPods) {
            const sourceDeck = decksByUuid[pod.deckId];
            if (!sourceDeck.houses.includes(pod.house)) {
                throw new Error('Failed to create deck. Invalid house selection for source deck');
            }
        }

        const selectedTokenId = deck.tokenCard && deck.tokenCard.id ? deck.tokenCard.id : undefined;
        const selectedTokenSourceDeck = deck.tokenSourceDeck;

        if (expansionRequiresToken && !selectedTokenId && !selectedTokenSourceDeck) {
            throw new Error('Token creature source must be specified for this set');
        }

        if (!expansionRequiresToken && (selectedTokenId || selectedTokenSourceDeck)) {
            throw new Error('Token creature reference cards are not allowed for this set');
        }

        const isTokenCreatureCard = (card) => {
            const cardType =
                card?.card?.type || cardsById?.[card?.id]?.type || allCardsById?.[card?.id]?.type;
            return card?.isNonDeck && card?.id !== 'the-tide' && cardType === 'token creature';
        };

        let tokenCardToAdd;
        if (expansionRequiresToken) {
            if (selectedTokenSourceDeck) {
                const sourceDeck = decksByUuid[selectedTokenSourceDeck];
                if (!sourceDeck || !selectedDeckIds.includes(selectedTokenSourceDeck)) {
                    throw new Error(
                        'Selected token source deck must contribute at least one selected pod'
                    );
                }

                tokenCardToAdd = sourceDeck.cards.find((card) => isTokenCreatureCard(card));
            } else {
                for (const selectedDeckId of selectedDeckIds) {
                    const selectedDeck = decksByUuid[selectedDeckId];
                    const tokenCard = selectedDeck.cards.find(
                        (card) => card.id === selectedTokenId && isTokenCreatureCard(card)
                    );

                    if (tokenCard) {
                        tokenCardToAdd = tokenCard;
                        break;
                    }
                }
            }

            if (!tokenCardToAdd) {
                throw new Error('Selected token creature must come from a contributing deck');
            }
        }

        const prophecySourceDecks = selectedDeckIds
            .map((selectedDeckId) => decksByUuid[selectedDeckId])
            .filter((selectedDeck) =>
                selectedDeck.cards.some(
                    (card) => (card.card && card.card.type === 'prophecy') || card.prophecyId
                )
            );

        if (!expansionSupportsProphecy && deck.prophecySourceDeck) {
            throw new Error('Prophecy cards are not allowed for this set');
        }

        let prophecySourceDeck;
        if (expansionSupportsProphecy && prophecySourceDecks.length > 0) {
            if (prophecySourceDecks.length === 1) {
                prophecySourceDeck = prophecySourceDecks[0];
                if (
                    deck.prophecySourceDeck &&
                    deck.prophecySourceDeck !== prophecySourceDeck.uuid
                ) {
                    throw new Error('Invalid prophecy source deck specified');
                }
            } else {
                if (!deck.prophecySourceDeck) {
                    throw new Error('Prophecy source deck must be specified for this alliance');
                }

                prophecySourceDeck = decksByUuid[deck.prophecySourceDeck];
                if (!prophecySourceDeck) {
                    throw new Error('Invalid prophecy source deck specified');
                }

                if (!selectedDeckIds.includes(prophecySourceDeck.uuid)) {
                    throw new Error(
                        'Prophecy source deck must contribute at least one selected pod'
                    );
                }

                const sourceHasProphecy = prophecySourceDeck.cards.some(
                    (card) => (card.card && card.card.type === 'prophecy') || card.prophecyId
                );
                if (!sourceHasProphecy) {
                    throw new Error(
                        'Selected prophecy source deck does not contain prophecy cards'
                    );
                }
            }
        }

        if (!expansionSupportsProphecy && prophecySourceDecks.length > 0) {
            throw new Error('Prophecy cards are not allowed for this set');
        }

        deck.houses = Constants.Houses.filter((house) =>
            parsedPods.some((pod) => pod.house === house)
        );

        let podCards = [];

        if (prophecySourceDeck) {
            const sourceProphecyCards = prophecySourceDeck.cards.filter(
                (card) => (card.card && card.card.type === 'prophecy') || card.prophecyId
            );

            for (let card of sourceProphecyCards) {
                podCards.push({
                    ...card,
                    prophecyId: card.prophecyId
                });
            }
        }

        if (expansionRequiresToken && tokenCardToAdd) {
            podCards.push(tokenCardToAdd);
        }

        for (let pod of parsedPods) {
            const dbDeck = decksByUuid[pod.deckId];
            const house = pod.house;

            for (let card of dbDeck.cards) {
                if ((card.card && card.card.type === 'prophecy') || card.prophecyId) {
                    continue;
                }

                if (card.card && card.card.type === 'archon power') {
                    continue;
                }

                if (card.isNonDeck) {
                    continue;
                }

                if (card.maverick === house || card.anomaly === house || card.house === house) {
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

        if (expansionRequiresTide) {
            podCards.push({
                count: 1,
                id: 'the-tide',
                isNonDeck: true
            });
        }

        const isSingleUnmodifiedArchonDeck = this.isSingleUnmodifiedArchonDeck(
            parsedPods,
            decksByUuid
        );
        if (!isSingleUnmodifiedArchonDeck) {
            this.validateAllianceRestrictedList(podCards, expansionId);
        }

        deck.lastUpdated = new Date();
        deck.identity = deck.name;
        deck.cards = podCards;
        deck.isAlliance = true;

        return this.insertDeck(deck, user);
    }

    isSingleUnmodifiedArchonDeck(parsedPods, decksByUuid) {
        const uniqueDeckIds = Array.from(new Set(parsedPods.map((pod) => pod.deckId)));
        if (uniqueDeckIds.length !== 1) {
            return false;
        }

        const sourceDeck = decksByUuid[uniqueDeckIds[0]];
        if (!sourceDeck || !Array.isArray(sourceDeck.houses) || sourceDeck.houses.length !== 3) {
            return false;
        }

        const selectedHouses = parsedPods.map((pod) => pod.house).sort();
        const sourceHouses = [...sourceDeck.houses].sort();

        return selectedHouses.join(':') === sourceHouses.join(':');
    }

    validateAllianceRestrictedList(cards, expansionId) {
        const applicableRules = Object.entries(allianceRestrictedRules)
            .filter(([, rule]) => rule.expansions.includes(expansionId))
            .reduce((acc, [cardId, rule]) => {
                acc[cardId] = rule;
                return acc;
            }, {});

        if (Object.keys(applicableRules).length === 0) {
            return;
        }

        const restrictedCardsInDeck = cards.filter(
            (card) => !card.isNonDeck && applicableRules[card.id]
        );

        const quantitiesByCardId = restrictedCardsInDeck.reduce((acc, card) => {
            acc[card.id] = (acc[card.id] || 0) + (card.count || 1);
            return acc;
        }, {});

        const restrictedCardIds = Object.keys(quantitiesByCardId);
        if (restrictedCardIds.length > 1) {
            throw new Error('Alliance deck may include cards from only one restricted card name');
        }

        const restrictedCardId = restrictedCardIds[0];
        if (!restrictedCardId) {
            return;
        }

        const rule = applicableRules[restrictedCardId];
        if (rule.maxQuantity && quantitiesByCardId[restrictedCardId] > rule.maxQuantity) {
            throw new Error(
                `Alliance restricted card ${restrictedCardId} exceeds quantity limit of ${rule.maxQuantity}`
            );
        }
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
                        !deck.isAlliance,
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

            if (user && deck.accolades && deck.accolades.length > 0) {
                let accoladeParams = [];
                for (let i = 0; i < deck.accolades.length; i++) {
                    const accolade = deck.accolades[i];
                    const shown = i < 3;
                    accoladeParams.push(deck.id, accolade.id, accolade.name, accolade.image, shown);
                }
                await db.query(
                    `INSERT INTO "DeckAccolades" ("DeckId", "AccoladeId", "Name", "ImageUrl", "Shown") VALUES ${expand(
                        deck.accolades.length,
                        5
                    )}`,
                    accoladeParams
                );
            }

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

    async delete(id) {
        try {
            await db.query('DELETE FROM "Decks" WHERE "Id" = $1', [id]);
        } catch (err) {
            logger.error('Failed to delete deck', err);

            throw new Error('Failed to delete deck');
        }
    }

    async deleteMany(ids) {
        if (!ids || ids.length === 0) {
            return;
        }

        try {
            await db.query(`DELETE FROM "Decks" WHERE "Id" IN ${expand(1, ids.length)}`, ids);
        } catch (err) {
            logger.error('Failed to delete decks', err);

            throw new Error('Failed to delete decks');
        }
    }

    async checkDeckOwnershipForUser(userId, ids) {
        if (!ids || ids.length === 0) {
            return { allExist: false, allOwned: false };
        }

        try {
            const result = await db.query(
                `SELECT COUNT(*) AS "TotalCount", 
                        COUNT(*) FILTER (WHERE "UserId" = $1) AS "OwnedCount"
                 FROM "Decks"
                 WHERE "Id" = ANY($2)`,
                [userId, ids]
            );
            const totalCount = parseInt(result[0].TotalCount, 10);
            const ownedCount = parseInt(result[0].OwnedCount, 10);

            return {
                allExist: totalCount === ids.length,
                allOwned: ownedCount === ids.length
            };
        } catch (err) {
            logger.error('Failed to verify deck ownership', err);

            throw new Error('Failed to verify deck ownership');
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
                'tomes-gigantica': true
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

            // Store sort_override for prophecy cards
            if (card.sort_override !== undefined && card.sort_override !== null) {
                retCard.sortOverride = card.sort_override;
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

            const normalizedHouse = card.house.toLowerCase().replace(' ', '');
            const cardData = allCards[retCard.id];

            if (!cardData) {
                logger.error(
                    'Deck import failed: missing card metadata for id %s (title %s) in deck %s',
                    retCard.id,
                    card.card_title,
                    deckResponse.data.id
                );
                throw new Error('There was a problem importing your deck, please try again later.');
            }

            // Revenants can be in any house, their real house is set on the deck itself.
            if (normalizedHouse !== cardData.house) {
                retCard.house = normalizedHouse;
            }

            // If this is one of the cards that has an entry for every house, get the correct house image
            if (specialCards[card.expansion] && specialCards[card.expansion][id]) {
                retCard.house = normalizedHouse;
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
                    // Preserve sortOverride for enhanced cards
                    if (card.sortOverride !== undefined) {
                        cardToAdd.sortOverride = card.sortOverride;
                    }

                    cardToAdd.count = 1;
                    toAdd.push(cardToAdd);
                }

                card.enhancements = enhancementsByCardId[card.uuid][0];
                card.count = 1;
            }
        }

        cards = cards.concat(toAdd);

        // Auto-assign prophecy IDs based on sort_override order (first two = 1, second two = 2)
        const prophecyCards = cards.filter(
            (card) => allCards[card.id] && allCards[card.id].type === 'prophecy'
        );
        if (prophecyCards.length === 4) {
            // Sort prophecy cards by sort_override field from API
            prophecyCards.sort((a, b) => {
                const aSort =
                    a.sortOverride !== undefined && a.sortOverride !== null
                        ? a.sortOverride
                        : Infinity;
                const bSort =
                    b.sortOverride !== undefined && b.sortOverride !== null
                        ? b.sortOverride
                        : Infinity;
                return aSort - bSort;
            });
            // First two prophecies get prophecyId 1, second two get prophecyId 2
            prophecyCards[0].prophecyId = 1;
            prophecyCards[1].prophecyId = 1;
            prophecyCards[2].prophecyId = 2;
            prophecyCards[3].prophecyId = 2;
        }

        let uuid = deckResponse.data.id;
        let anyIllegalCards = cards.find(
            (card) =>
                !card.id
                    .split('')
                    .every((char) =>
                        'æaăàáãǎâbcdeĕèéěfghĭìíǐijklmnoöǑŏòóõǒpqrstuŭùúǔüvwxyz0123456789-[]*…'.includes(
                            char
                        )
                    )
        );
        if (anyIllegalCards) {
            logger.error(`DECK IMPORT ERROR: ${anyIllegalCards.id}`);

            return undefined;
        }

        const accolades = (deckResponse._linked.accolades || [])
            .filter((a) => a.visible)
            .map((a) => ({ id: a.id, name: a.name, image: a.image }));

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
            accolades: accolades,
            lastUpdated: new Date()
        };
    }

    async refreshAccolades(deckId, user) {
        const deck = await this.getById(deckId);
        if (!deck) {
            throw new Error('Deck not found');
        }

        if (deck.username !== user.username) {
            throw new Error('Unauthorized');
        }

        let deckResponse;
        try {
            let response = await util.httpRequest(
                `https://www.keyforgegame.com/api/decks/${deck.uuid}/?links=cards`,
                { allowedHosts: ['www.keyforgegame.com'] }
            );

            if (response[0] === '<') {
                logger.error('Failed to refresh accolades: %s %s', deck.uuid, response);
                throw new Error('Invalid response from API. Please try again later.');
            }

            deckResponse = JSON.parse(response);
        } catch (error) {
            logger.error(`Unable to refresh accolades for deck ${deck.uuid}`, error);
            throw new Error('Invalid response from API. Please try again later.');
        }

        if (!deckResponse || !deckResponse._linked || !deckResponse.data) {
            throw new Error('Invalid response from API. Please try again later.');
        }

        const accolades = (deckResponse._linked.accolades || [])
            .filter((a) => a.visible)
            .map((a) => ({ id: a.id, name: a.name, image: a.image }));

        const existingAccolades = await db.query(
            'SELECT "AccoladeId", "Shown" FROM "DeckAccolades" WHERE "DeckId" = $1',
            [deckId]
        );
        const shownMap = {};
        for (const existing of existingAccolades) {
            shownMap[existing.AccoladeId] = existing.Shown;
        }

        const resultShownMap = {};
        await db.query('BEGIN');
        try {
            await db.query('DELETE FROM "DeckAccolades" WHERE "DeckId" = $1', [deckId]);

            if (accolades.length > 0) {
                let shownCount = 0;
                let accoladeParams = [];
                for (const accolade of accolades) {
                    let shown = shownMap[accolade.id];
                    if (shown === undefined) {
                        shown = shownCount < 3;
                        if (shown) {
                            shownCount++;
                        }
                    }
                    resultShownMap[accolade.id] = shown;
                    accoladeParams.push(deckId, accolade.id, accolade.name, accolade.image, shown);
                }
                await db.query(
                    `INSERT INTO "DeckAccolades" ("DeckId", "AccoladeId", "Name", "ImageUrl", "Shown") VALUES ${expand(
                        accolades.length,
                        5
                    )}`,
                    accoladeParams
                );
            }

            await db.query('COMMIT');
        } catch (err) {
            await db.query('ROLLBACK');
            logger.error('Failed to refresh accolades', err);
            throw new Error('Failed to update accolades in database');
        }

        return accolades.map((a) => ({
            ...a,
            shown: resultShownMap[a.id] || false
        }));
    }

    async updateAccoladeShown(deckId, accoladeId, shown, user) {
        const deck = await this.getById(deckId);
        if (!deck) {
            throw new Error('Deck not found');
        }

        if (deck.username !== user.username) {
            throw new Error('Unauthorized');
        }

        if (shown) {
            const shownCount = await db.query(
                'SELECT COUNT(*) as count FROM "DeckAccolades" WHERE "DeckId" = $1 AND "Shown" = true',
                [deckId]
            );
            if (shownCount[0].count >= 3) {
                throw new Error('Maximum of 3 accolades can be shown');
            }
        }

        await db.query(
            'UPDATE "DeckAccolades" SET "Shown" = $1 WHERE "DeckId" = $2 AND "AccoladeId" = $3',
            [shown, deckId, accoladeId]
        );
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
            winRate: deck.WinRate
        };
    }
}

module.exports = DeckService;
