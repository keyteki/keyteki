const logger = require('../log');
const util = require('../util');
const db = require('../db');
const { expand, flatten } = require('../Array');

class DeckService {
    constructor(configService) {
        this.configService = configService;
    }

    async getById(id) {
        let deck;

        try {
            deck = await db.query('SELECT d.*, u."Username", e."ExpansionId" as "Expansion", (SELECT COUNT(*) FROM "Decks" WHERE "Name" = d."Name") AS DeckCount, ' +
            '(SELECT COUNT(*) FROM "Games" g JOIN "GamePlayers" gp ON gp."GameId" = g."Id" WHERE g."WinnerId" = $1 AND gp."DeckId" = d."Id") AS "WinCount", ' +
            '(SELECT COUNT(*) FROM "Games" g JOIN "GamePlayers" gp ON gp."GameId" = g."Id" WHERE g."WinnerId" != $1 AND g."WinnerId" IS NOT NULL AND gp."PlayerId" = $1 AND gp."DeckId" = d."Id") AS "LoseCount" ' +
            'FROM "Decks" d ' +
            'JOIN "Users" u ON u."Id" = "UserId" ' +
            'JOIN "Expansions" e on e."Id" = d."ExpansionId" ' +
            'WHERE d."Id" = $1 ', [id]);
        } catch(err) {
            logger.error(`Failed to retrieve deck: ${id}`, err);

            throw new Error('Unable to fetch deck: ' + id);
        }

        if(!deck || deck.length === 0) {
            logger.warn(`Failed to retrieve deck: ${id} as it was not found`);

            return undefined;
        }

        let retDeck = this.mapDeck(deck[0]);

        await this.getDeckCardsAndHouses(retDeck);

        return retDeck;
    }

    async getStandaloneDeckById(standaloneId) {
        let deck;

        try {
            deck = await db.query('SELECT d.*, e."ExpansionId" as "Expansion" ' +
            'FROM "StandaloneDecks" d ' +
            'JOIN "Expansions" e on e."Id" = d."ExpansionId" ' +
            'WHERE d."Id" = $1 ', [standaloneId]);
        } catch(err) {
            logger.error(`Failed to retrieve deck: ${standaloneId}`, err);

            throw new Error('Unable to fetch deck: ' + standaloneId);
        }

        if(!deck || deck.length === 0) {
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
            decks = await db.query('SELECT d.*, e."ExpansionId" as "Expansion" ' +
            'FROM "StandaloneDecks" d ' +
            'JOIN "Expansions" e on e."Id" = d."ExpansionId"');
        } catch(err) {
            logger.error('Failed to retrieve standalone decks', err);

            throw new Error('Unable to fetch standalone decks');
        }

        if(!decks || decks.length === 0) {
            logger.warn('Failed to retrieve standalone decks, none found');

            return undefined;
        }

        let retDecks = [];
        for(const deck of decks) {
            let retDeck = this.mapDeck(deck);

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

        if(expansions.aoa) {
            dbExpansions.push(435);
        }

        if(expansions.cota) {
            dbExpansions.push(341);
        }

        if(expansions.wc) {
            dbExpansions.push(452);
        }

        let deck;
        let expansionStr = dbExpansions.join(',');
        try {
            deck = await db.query(`SELECT d.*, e."ExpansionId" AS "Expansion" from "Decks" d JOIN "Expansions" e on e."Id" = d."ExpansionId" WHERE d."ExpansionId" IN (SELECT "Id" FROM "Expansions" WHERE "ExpansionId" IN(${expansionStr})) AND "IncludeInSealed" = True ORDER BY random() LIMIT 1`);
        } catch(err) {
            logger.error('Failed to fetch random deck', err);
            throw new Error('Failed to fetch random deck');
        }

        if(!deck || deck.length === 0) {
            logger.warn('Could not find any sealed decks!');
            return undefined;
        }

        let retDeck = this.mapDeck(deck[0]);

        await this.getDeckCardsAndHouses(retDeck);

        return retDeck;
    }

    async findForUser(user) {
        let retDecks = [];
        let decks;

        try {
            decks = await db.query('SELECT d.*, u."Username", e."ExpansionId" as "Expansion", (SELECT COUNT(*) FROM "Decks" WHERE "Name" = d."Name") AS DeckCount, ' +
            '(SELECT COUNT(*) FROM "Games" g JOIN "GamePlayers" gp ON gp."GameId" = g."Id" WHERE g."WinnerId" = $1 AND gp."DeckId" = d."Id") AS "WinCount", ' +
            '(SELECT COUNT(*) FROM "Games" g JOIN "GamePlayers" gp ON gp."GameId" = g."Id" WHERE g."WinnerId" != $1 AND g."WinnerId" IS NOT NULL AND gp."PlayerId" = $1 AND gp."DeckId" = d."Id") AS "LoseCount" ' +
            'FROM "Decks" d ' +
            'JOIN "Users" u ON u."Id" = "UserId" ' +
            'JOIN "Expansions" e on e."Id" = d."ExpansionId" ' +
            'WHERE "UserId" = $1 ' +
            'ORDER BY "LastUpdated" DESC', [user.id]);
        } catch(err) {
            logger.error('Failed to retrieve decks', err);
        }

        for(let deck of decks) {
            let retDeck = this.mapDeck(deck);

            await this.getDeckCardsAndHouses(retDeck);

            retDecks.push(retDeck);
        }

        return retDecks;
    }

    async getDeckCardsAndHouses(deck, standalone = false) {
        let cardTable = standalone ? 'StandaloneDeckCards' : 'DeckCards';
        let cards = await db.query(`SELECT * FROM "${cardTable}" WHERE "DeckId" = $1`, [deck.id]);

        deck.cards = cards.map(card => ({
            id: card.CardId,
            count: card.Count,
            maverick: card.Maverick || undefined,
            anomaly: card.Anomaly || undefined,
            enhancements: card.Enhancements ? card.Enhancements.replace(/[[{}"\]]/gi, '').split(',') : undefined
        }));

        let houseTable = standalone ? 'StandaloneDeckHouses' : 'DeckHouses';
        let houses = await db.query(`SELECT * FROM "${houseTable}" dh JOIN "Houses" h ON h."Id" = dh."HouseId" WHERE "DeckId" = $1`, [deck.id]);
        deck.houses = houses.map(house => house.Code);

        deck.isStandalone = standalone;
    }

    async create(user, deck) {
        let deckResponse;

        try {
            let response = await util.httpRequest(`https://www.keyforgegame.com/api/decks/${deck.uuid}/?links=cards`);

            if(response[0] === '<') {
                logger.error('Deck failed to import: %s %s', deck.uuid, response);

                return;
            }

            deckResponse = JSON.parse(response);
        } catch(error) {
            logger.error(`Unable to import deck ${deck.uuid}`, error);

            return;
        }

        if(!deckResponse || !deckResponse._linked || !deckResponse.data) {
            return;
        }

        let newDeck = this.parseDeckResponse(deck.username, deckResponse);

        return this.insertDeck(newDeck, user);
    }

    async insertDeck(deck, user) {
        let ret;

        try {
            await db.query('BEGIN');

            if(user) {
                ret = await db.query('INSERT INTO "Decks" ("UserId", "Uuid", "Identity", "Name", "IncludeInSealed", "LastUpdated", "Verified", "ExpansionId", "Flagged", "Banned") ' +
                'VALUES ($1, $2, $3, $4, $5, $6, false, (SELECT "Id" FROM "Expansions" WHERE "ExpansionId" = $7), false, false) RETURNING "Id"', [user.id, deck.uuid, deck.identity, deck.name, false, deck.lastUpdated, deck.expansion]);
            } else {
                ret = await db.query('INSERT INTO "StandaloneDecks" ("Identity", "Name", "LastUpdated", "ExpansionId") ' +
                'VALUES ($1, $2, $3, (SELECT "Id" FROM "Expansions" WHERE "ExpansionId" = $4)) RETURNING "Id"', [deck.identity, deck.name, deck.lastUpdated || new Date(), deck.expansion]);
            }
        } catch(err) {
            logger.error('Failed to add deck', err);

            await db.query('ROLLBACK');

            throw new Error('Failed to import deck');
        }

        deck.id = ret[0].Id;

        let params = [];
        for(let card of deck.cards) {
            params.push(card.id);
            params.push(card.count);
            params.push(card.maverick);
            params.push(card.anomaly);
            params.push(deck.id);
            if(!user) {
                params.push(card.enhancements);
            }
        }

        try {
            if(user) {
                await db.query(`INSERT INTO "DeckCards" ("CardId", "Count", "Maverick", "Anomaly", "DeckId") VALUES ${expand(deck.cards.length, 5)}`, params);
            } else {
                await db.query(`INSERT INTO "StandaloneDeckCards" ("CardId", "Count", "Maverick", "Anomaly", "DeckId", "Enhancements") VALUES ${expand(deck.cards.length, 6)}`, params);
            }
        } catch(err) {
            logger.error('Failed to add deck', err);

            await db.query('ROLLBACK');

            throw new Error('Failed to import deck');
        }

        let deckHouseTable = user ? '"DeckHouses"' : '"StandaloneDeckHouses"';
        try {
            await db.query(`INSERT INTO ${deckHouseTable} ("DeckId", "HouseId") VALUES ($1, (SELECT "Id" FROM "Houses" WHERE "Code" = $2)), ` +
            '($1, (SELECT "Id" FROM "Houses" WHERE "Code" = $3)), ($1, (SELECT "Id" FROM "Houses" WHERE "Code" = $4))', flatten([deck.id, deck.houses]));

            await db.query('COMMIT');
        } catch(err) {
            logger.error('Failed to add deck', err);

            await db.query('ROLLBACK');

            throw new Error('Failed to import deck');
        }

        return deck;
    }

    async update(deck) {
        try {
            await db.query('UPDATE "Decks" SET "Verified" = true, "LastUpdated" = $2 WHERE "Id" = $1', [deck.id, new Date()]);
        } catch(err) {
            logger.error('Failed to update deck', err);

            throw new Error('Failed to update deck');
        }
    }

    async delete(id) {
        try {
            await db.query('DELETE FROM "Decks" WHERE "Id" = $1', [id]);
        } catch(err) {
            logger.error('Failed to delete deck', err);

            throw new Error('Failed to delete deck');
        }
    }

    async getFlaggedUnverifiedDecksForUser(user) {
        let retDecks = [];
        let decks;

        try {
            decks = await db.query('SELECT d.*, u."Username", e."ExpansionId" as "Expansion", (SELECT COUNT(*) FROM "Decks" WHERE "Name" = d."Name") AS "DeckCount", ' +
            '(SELECT COUNT(*) FROM "Games" g JOIN "GamePlayers" gp ON gp."GameId" = g."Id" WHERE g."WinnerId" = $1 AND gp."DeckId" = d."Id") AS "WinCount", ' +
            '(SELECT COUNT(*) FROM "Games" g JOIN "GamePlayers" gp ON gp."GameId" = g."Id" WHERE g."WinnerId" != $1 AND g."WinnerId" IS NOT NULL AND gp."PlayerId" = $1 AND gp."DeckId" = d."Id") AS "LoseCount" ' +
            'FROM "Decks" d ' +
            'JOIN "Users" u ON u."Id" = "UserId" ' +
            'JOIN "Expansions" e on e."Id" = d."ExpansionId" ' +
            'WHERE u."Id" = $1 AND d."Verified" = False AND (SELECT COUNT(*) FROM "Decks" WHERE "Name" = d."Name") > $2', [user.id, this.configService.getValueForSection('lobby', 'lowerDeckThreshold')]);
        } catch(err) {
            logger.error(`Failed to retrieve unverified decks: ${user.id}`, err);

            throw new Error(`Unable to fetch unverified decks: ${user.id}`);
        }

        for(let deck of decks) {
            let retDeck = this.mapDeck(deck);

            await this.getDeckCardsAndHouses(deck);

            retDecks.push(retDeck);
        }

        return retDecks;
    }

    async verifyDecksForUser(user) {
        try {
            await db.query('UPDATE "Decks" SET "Verified" = True WHERE "UserId" = $1 AND "Verified" = False', [user.id]);
        } catch(err) {
            logger.error(`Failed to verify decks: ${user.id}`, err);

            throw new Error(`Unable to unverify decks: ${user.id}`);
        }
    }

    parseDeckResponse(username, deckResponse) {
        let cards = deckResponse._linked.cards.map(card => {
            let id = card.card_title.toLowerCase().replace(/[,?.!"„“”]/gi, '').replace(/[ '’]/gi, '-');
            if(card.is_maverick) {
                return { id: id, count: 1, maverick: card.house.replace(' ', '').toLowerCase() };
            }

            if(card.is_anomaly) {
                return { id: id, count: 1, anomaly: card.house.replace(' ', '').toLowerCase() };
            }

            return { id: id, count: deckResponse.data._links.cards.filter(uuid => uuid === card.id).length };
        });
        let uuid = deckResponse.data.id;

        let anyIllegalCards = cards.find(card => !card.id.split('').every(char => 'æabcdefghijklmnoöpqrstuvwxyz0123456789-[]'.includes(char)));
        if(anyIllegalCards) {
            logger.error(`DECK IMPORT ERROR: ${anyIllegalCards.id.split('').map(char => char.charCodeAt(0))}`);

            return undefined;
        }

        return {
            expansion: deckResponse.data.expansion,
            username: username,
            uuid: uuid,
            identity: deckResponse.data.name.toLowerCase().replace(/[,?.!"„“”]/gi, '').replace(/[ '’]/gi, '-'),
            cardback: '',
            name: deckResponse.data.name,
            houses: deckResponse.data._links.houses.map(house => house.replace(' ', '').toLowerCase()),
            cards: cards,
            lastUpdated: new Date()
        };
    }

    mapDeck(deck) {
        return {
            id: deck.Id,
            username: deck.Username,
            uuid: deck.Uuid,
            identity: deck.Identity,
            name: deck.Name,
            lastUpdated: deck.LastUpdated,
            verified: deck.Verified,
            expansion: deck.Expansion,
            wins: deck.WinCount,
            losses: deck.LoseCount,
            usageCount: deck.DeckCount
        };
    }
}

module.exports = DeckService;

