const fs = require('fs');
const path = require('path');

const DeckService = require('../../../server/services/DeckService');
const { buildCardMapFromPacks } = require('../../helpers/packcards');

/*
 * Imports real Master Vault deck responses (see test/fixtures/master-vault) and compares the
 * result with the recorded output in expected/. To re-record after an intended change:
 *
 *   UPDATE_DECK_IMPORT_FIXTURES=1 npm test -- test/server/deckimport
 */
const FixtureDir = path.join(__dirname, '../../fixtures/master-vault');
const Manifest = JSON.parse(fs.readFileSync(path.join(FixtureDir, 'manifest.json'), 'utf8'));
const UpdateExpected = !!process.env.UPDATE_DECK_IMPORT_FIXTURES;

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

describe('Master Vault deck import', function () {
    let deckService;

    beforeAll(function () {
        const cards = buildCardMapFromPacks();
        deckService = new DeckService({}, { getAllCards: async () => cards });
    });

    for (const entry of Manifest) {
        it(`imports ${entry.name} (${entry.cases.join(', ')})`, async function () {
            const deckResponse = readJson(path.join(FixtureDir, 'decks', `${entry.uuid}.json`));

            let result;
            try {
                const deck = await deckService.parseDeckResponse('test', deckResponse);
                if (deck) {
                    delete deck.lastUpdated;
                }

                result = { deck: deck || null };
            } catch (err) {
                result = { error: err.message };
            }

            const expectedPath = path.join(FixtureDir, 'expected', `${entry.uuid}.json`);
            if (UpdateExpected) {
                fs.mkdirSync(path.dirname(expectedPath), { recursive: true });
                fs.writeFileSync(expectedPath, JSON.stringify(result, null, 4) + '\n');
            }

            expect(result).toEqual(readJson(expectedPath));
        });
    }

    it('lists the cards it does not recognise', async function () {
        const entry = Manifest[0];
        const deckResponse = readJson(path.join(FixtureDir, 'decks', `${entry.uuid}.json`));
        Object.assign(deckResponse._linked.cards[0], {
            card_title: 'Not A Real Card',
            card_title_en: 'Not A Real Card',
            expansion: 999
        });

        const error = await deckService.parseDeckResponse('test', deckResponse).catch((e) => e);

        expect(error.message).toBe(
            "This deck contains cards that aren't supported yet: Not A Real Card (not-a-real-card)"
        );
        expect(error.unknownCards).toEqual([
            {
                id: 'not-a-real-card',
                title: 'Not A Real Card',
                expansion: 999,
                number: deckResponse._linked.cards[0].card_number,
                house: deckResponse._linked.cards[0].house.toLowerCase().replace(' ', ''),
                type: deckResponse._linked.cards[0].card_type,
                masterVaultId: deckResponse._linked.cards[0].id
            }
        ]);
    });
});
