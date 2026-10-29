/*eslint no-console:0 */
const commandLineArgs = require('command-line-args');

const db = require('../db');
const CardService = require('../services/CardService');
const ConfigService = require('../services/ConfigService');
const DeckService = require('../services/DeckService');
const { PrintingIndex } = require('../../master-vault-data/src/printings');
const { matchDeckCards } = require('./deckcardmatcher');

//
// Stores the house of every card in decks imported before deck import stored them.
//
// Most houses are worked out from the deck's expansion and houses. Cards that can't be worked out
// that way (e.g. a card printed in two of the deck's houses in the same set) need the deck
// fetching from Master Vault again, which --fetch does, one deck at a time.
//
// # Report what would change
// node server/scripts/backfilldeckhouses
//
// # Store the houses that can be worked out
// node server/scripts/backfilldeckhouses --apply
//
// # Also fetch up to 500 decks from Master Vault for the rest, 3 seconds apart
// node server/scripts/backfilldeckhouses --apply --fetch --limit 500 --delay 3000
//
const optionsDefinition = [
    { name: 'apply', type: Boolean, defaultValue: false },
    { name: 'fetch', type: Boolean, defaultValue: false },
    { name: 'limit', type: Number, defaultValue: 0 },
    { name: 'delay', type: Number, defaultValue: 3000 },
    { name: 'batch-size', type: Number, defaultValue: 1000 }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class DeckHouseBackfill {
    constructor(options) {
        this.options = options;
        this.cardService = new CardService(new ConfigService());
        this.deckService = new DeckService(new ConfigService(), this.cardService);
        this.printings = PrintingIndex.fromPacks();
        this.stats = { decks: 0, rows: 0, inferred: 0, fetched: 0, fromMasterVault: 0 };
        this.unresolvedDecks = [];
    }

    async run() {
        let lastId = 0;
        for (;;) {
            const decks = await db.query(
                'SELECT d."Id", d."Uuid", d."IsAlliance", e."ExpansionId" AS "Expansion", ' +
                    'ARRAY(SELECT h."Code" FROM "DeckHouses" dh JOIN "Houses" h ON h."Id" = dh."HouseId" WHERE dh."DeckId" = d."Id") AS "Houses" ' +
                    'FROM "Decks" d JOIN "Expansions" e ON e."Id" = d."ExpansionId" ' +
                    'WHERE d."Id" > $1 AND EXISTS (SELECT 1 FROM "DeckCards" dc WHERE dc."DeckId" = d."Id" AND dc."HouseId" IS NULL) ' +
                    'ORDER BY d."Id" LIMIT $2',
                [lastId, this.options['batch-size']]
            );
            if (decks.length === 0) {
                break;
            }

            lastId = decks[decks.length - 1].Id;
            await this.inferBatch(decks);
        }

        console.log(
            `${this.stats.decks} decks with ${this.stats.rows} cards missing a house: ` +
                `${this.stats.inferred} worked out, ${
                    this.stats.rows - this.stats.inferred
                } need ` +
                `${this.unresolvedDecks.length} decks fetching from Master Vault`
        );

        if (this.options.fetch) {
            await this.fetchUnresolved();
        }

        if (!this.options.apply) {
            console.log('Nothing was changed. Run with --apply to store the houses.');
        }
    }

    async inferBatch(decks) {
        const rows = await db.query(
            'SELECT "Id", "DeckId", "CardId", "Count", "Maverick", "Anomaly", "Enhancements", "IsNonDeck" ' +
                'FROM "DeckCards" WHERE "DeckId" = ANY($1) AND "HouseId" IS NULL',
            [decks.map((deck) => deck.Id)]
        );
        const decksById = new Map(decks.map((deck) => [deck.Id, deck]));
        const updates = [];
        const unresolved = new Map();

        for (const row of rows) {
            const deck = decksById.get(row.DeckId);
            const house =
                row.Maverick ||
                row.Anomaly ||
                this.printings.inferHouse(
                    row.CardId,
                    { expansion: deck.Expansion, houses: deck.Houses },
                    { nonDeck: !!row.IsNonDeck }
                );

            if (house) {
                updates.push({ id: row.Id, house: house });
            } else if (!deck.IsAlliance) {
                unresolved.set(deck.Id, [...(unresolved.get(deck.Id) || []), row]);
            }
        }

        this.stats.decks += decks.length;
        this.stats.rows += rows.length;
        this.stats.inferred += updates.length;
        for (const [deckId, deckRows] of unresolved) {
            this.unresolvedDecks.push({ deck: decksById.get(deckId), rows: deckRows });
        }

        await this.store(updates);
    }

    async fetchUnresolved() {
        const limit = this.options.limit || this.unresolvedDecks.length;
        for (const { deck, rows } of this.unresolvedDecks.slice(0, limit)) {
            let response = await this.deckService.getMasterVaultResponse(deck.Uuid);
            if (!response) {
                if (this.stats.fetched > 0) {
                    await sleep(this.options.delay);
                }

                try {
                    this.stats.fetched++;
                    response = await this.deckService.fetchDeckResponse(deck.Uuid);
                } catch (err) {
                    console.log(`Could not fetch deck ${deck.Uuid}: ${err.message}`);
                    continue;
                }
            }

            let parsed;
            try {
                parsed = await this.deckService.parseDeckResponse('', response);
            } catch (err) {
                console.log(`Could not read deck ${deck.Uuid}: ${err.message}`);
                continue;
            }

            const updates = matchDeckCards(rows, parsed.cards);
            this.stats.fromMasterVault += updates.length;
            await this.store(updates);
        }

        console.log(
            `Fetched ${this.stats.fetched} decks, ${this.stats.fromMasterVault} houses found from Master Vault`
        );
    }

    async store(updates) {
        if (!this.options.apply || updates.length === 0) {
            return;
        }

        // Also stores any maverick/anomaly Master Vault has that the stored card is missing
        await db.query(
            'UPDATE "DeckCards" dc SET "HouseId" = h."Id", ' +
                '"Maverick" = COALESCE(dc."Maverick", v."Maverick"), "Anomaly" = COALESCE(dc."Anomaly", v."Anomaly") ' +
                'FROM unnest($1::int[], $2::text[], $3::text[], $4::text[]) AS v("Id", "House", "Maverick", "Anomaly") ' +
                'JOIN "Houses" h ON h."Code" = v."House" ' +
                'WHERE dc."Id" = v."Id"',
            [
                updates.map((update) => update.id),
                updates.map((update) => update.house),
                updates.map((update) => update.maverick || null),
                updates.map((update) => update.anomaly || null)
            ]
        );
    }
}

const options = commandLineArgs(optionsDefinition);
const backfill = new DeckHouseBackfill(options);

backfill
    .run()
    .then(() => 0)
    .catch((err) => {
        console.error('Backfill failed', err);

        return 1;
    })
    .then(async (code) => {
        await backfill.cardService.shutdown();
        process.exit(code);
    });
