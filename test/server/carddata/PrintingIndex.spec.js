const fs = require('fs');
const path = require('path');

const { PrintingIndex } = require('../../../master-vault-data/src/printings');
const {
    cardIdFromMasterVault,
    isGiganticArtHalf
} = require('../../../master-vault-data/src/cardId');
const { getExpansion } = require('../../../master-vault-data/src/expansions');

const FixtureDir = path.join(__dirname, '../../fixtures/master-vault');

function masterVaultCard(properties) {
    return {
        card_title: 'Troll',
        card_type: 'Creature',
        card_text: 'Reap: Troll heals 3 damage.',
        power: '8',
        rarity: 'Common',
        ...properties
    };
}

describe('Printing index', function () {
    describe('with the pack data', function () {
        let index;

        beforeAll(function () {
            index = PrintingIndex.fromPacks();
        });

        it('resolves every card in the fixture decks to the id derived from its title', function () {
            const manifest = JSON.parse(
                fs.readFileSync(path.join(FixtureDir, 'manifest.json'), 'utf8')
            );
            const unresolvedExpansions = new Set();

            for (const entry of manifest) {
                const deck = JSON.parse(
                    fs.readFileSync(path.join(FixtureDir, 'decks', `${entry.uuid}.json`), 'utf8')
                );
                for (const card of deck._linked.cards) {
                    const id = index.resolveCardId(card);
                    if (id === undefined) {
                        unresolvedExpansions.add(card.expansion);
                        continue;
                    }

                    const titleId =
                        cardIdFromMasterVault(card) + (isGiganticArtHalf(card) ? '2' : '');
                    expect(id).toBe(titleId);
                }
            }

            // Only reprint sets, which have no pack file, can't be resolved by printing
            for (const expansionId of unresolvedExpansions) {
                expect(getExpansion(expansionId).pack).toBeUndefined();
            }
        });

        it('uses the most recently released printing as the latest', function () {
            // Lord Golgotha was reprinted many times, most recently in Prophetic Visions
            expect(index.getLatestPrinting('lord-golgotha').expansion).toBe(886);
            expect(index.getLatestPrinting('not-a-card')).toBeUndefined();
        });

        it("works out each card's house in the fixture decks, or leaves it undecided", function () {
            const undecided = [];
            for (const file of fs.readdirSync(path.join(FixtureDir, 'expected'))) {
                const { deck } = JSON.parse(
                    fs.readFileSync(path.join(FixtureDir, 'expected', file), 'utf8')
                );
                if (!deck) {
                    continue;
                }

                for (const card of deck.cards.filter((c) => !c.maverick && !c.anomaly)) {
                    const house = index.inferHouse(card.id, deck, { nonDeck: card.isNonDeck });
                    if (house === undefined) {
                        undecided.push(card.id);
                    } else {
                        expect(`${card.id} ${house}`).toBe(`${card.id} ${card.house}`);
                    }
                }
            }

            // Cards printed in more than one of the deck's houses in the deck's set, and a
            // Colossipede printed in a house the pack data doesn't have
            expect(undecided.sort()).toEqual([
                'build-your-champion',
                'build-your-champion',
                'colossipede',
                'digging-up-the-monster',
                'it-s-coming',
                'tomes-gigantica'
            ]);
        });
    });

    describe('with synthetic printings', function () {
        let index;

        beforeEach(function () {
            index = new PrintingIndex([
                { id: 'troll', expansion: 341, number: '048', house: 'brobnar', image: 'a' },
                { id: 'deusillus', expansion: 479, number: '244', house: 'saurian', image: 'b' },
                { id: 'deusillus2', expansion: 479, number: '244', house: 'saurian', image: 'c' },
                { id: 'veylan-analyst', expansion: 341, number: '305', house: 'logos', image: 'd' },
                { id: 'it-s-coming', expansion: 341, number: '305', house: 'logos', image: 'e' },
                { id: 'corrode', expansion: 939, number: '010', house: 'logos', image: 'f' },
                { id: 'corrode', expansion: 886, number: '020', house: 'logos', image: 'g' }
            ]);
        });

        it('resolves a card by expansion and number, regardless of title', function () {
            expect(
                index.resolveCardId(
                    masterVaultCard({ expansion: 341, card_number: '048', card_title: 'Not Troll' })
                )
            ).toBe('troll');
        });

        it('returns undefined for an unknown printing', function () {
            expect(
                index.resolveCardId(masterVaultCard({ expansion: 341, card_number: '999' }))
            ).toBeUndefined();
        });

        it('tells gigantic halves apart by card type', function () {
            const base = masterVaultCard({
                expansion: 479,
                card_number: '244',
                card_title: 'Deusillus',
                card_type: 'Gigantic Creature Base'
            });
            const art = { ...base, card_type: 'Gigantic Creature Art', power: null };
            const legacyArt = { ...base, card_type: 'Creature2', power: null };

            expect(index.resolveCardId(base)).toBe('deusillus');
            expect(index.resolveCardId(art)).toBe('deusillus2');
            expect(index.resolveCardId(legacyArt)).toBe('deusillus2');
        });

        it('tells cards sharing a number apart by title', function () {
            const card = masterVaultCard({ expansion: 341, card_number: '305' });

            expect(index.resolveCardId({ ...card, card_title: 'It’s Coming' })).toBe('it-s-coming');
            expect(index.resolveCardId({ ...card, card_title: 'Veylan Analyst' })).toBe(
                'veylan-analyst'
            );
            expect(index.resolveCardId({ ...card, card_title: 'Something Else' })).toBeUndefined();
        });

        it('orders printings by release date rather than expansion id', function () {
            // Vault Masters 2025 (939) came out before Prophetic Visions (886)
            expect(index.getLatestPrinting('corrode').expansion).toBe(886);
        });
    });

    describe('images', function () {
        let index;

        beforeEach(function () {
            index = new PrintingIndex([
                {
                    id: 'troll',
                    expansion: 341,
                    number: '048',
                    house: 'brobnar',
                    image: 'troll-cota'
                },
                { id: 'troll', expansion: 479, number: '040', house: 'brobnar', image: 'troll-mm' },
                {
                    id: 'lord-golgotha',
                    expansion: 341,
                    number: '252',
                    house: 'sanctum',
                    image: 'golgotha-cota'
                },
                {
                    id: 'lord-golgotha',
                    expansion: 886,
                    number: '097',
                    house: 'redemption',
                    image: 'golgotha-pv'
                },
                {
                    id: 'orb-of-wonder',
                    expansion: 453,
                    number: 'A06',
                    house: 'brobnar',
                    image: 'orb-anomaly',
                    anomaly: true
                },
                {
                    id: 'orb-of-wonder',
                    expansion: 479,
                    number: '173',
                    house: 'sanctum',
                    image: 'orb-mm'
                }
            ]);
        });

        it('uses the plain image for cards only printed in one house', function () {
            expect(index.hasHouseImages('troll')).toBe(false);
            expect(index.getImageName('troll', 'brobnar')).toBe('troll');
            expect(index.getImages('troll')).toEqual([
                { name: 'troll', printing: expect.objectContaining({ image: 'troll-mm' }) }
            ]);
        });

        it('uses a house image for cards printed in more than one house', function () {
            expect(index.getImageName('lord-golgotha', 'sanctum')).toBe('lord-golgotha-sanctum');
            expect(index.getImageName('lord-golgotha', 'redemption')).toBe(
                'lord-golgotha-redemption'
            );
            expect(index.getImages('lord-golgotha').map((image) => image.name)).toEqual([
                'lord-golgotha',
                'lord-golgotha-sanctum',
                'lord-golgotha-redemption'
            ]);
        });

        it('uses the plain image for mavericks and anomalies', function () {
            expect(index.getImageName('lord-golgotha', 'dis', { maverick: true })).toBe(
                'lord-golgotha'
            );
            expect(index.getImageName('orb-of-wonder', 'logos', { anomaly: true })).toBe(
                'orb-of-wonder'
            );
        });

        it('keeps the anomaly art as the plain image once an anomaly has a normal printing', function () {
            expect(index.getImageName('orb-of-wonder', 'sanctum')).toBe('orb-of-wonder-sanctum');
            expect(index.getImages('orb-of-wonder')).toEqual([
                {
                    name: 'orb-of-wonder',
                    printing: expect.objectContaining({ image: 'orb-anomaly' })
                },
                {
                    name: 'orb-of-wonder-sanctum',
                    printing: expect.objectContaining({ image: 'orb-mm' })
                }
            ]);
        });
    });
});
