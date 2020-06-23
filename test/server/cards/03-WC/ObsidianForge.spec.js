describe('Obsidian Forge', function () {
    describe("Obsidian Forge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 6,
                    inPlay: [
                        'obsidian-forge',
                        'groke',
                        'hebe-the-huge',
                        'ganger-chieftain',
                        'bellowing-patrizate',
                        'king-of-the-crag',
                        'brammo',
                        'bingle-bangbang',
                        'firespitter'
                    ],
                    discard: ['soul-snatcher']
                },
                player2: {
                    amber: 0,
                    inPlay: ['mighty-tiger', 'hunting-witch'],
                    hand: ['foggify']
                }
            });
        });

        it('should allow key to be forged at [6] if 6 creatures are sacrificed', function () {
            this.player1.clickCard(this.obsidianForge);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Obsidian Forge');
            this.player1.clickCard(this.groke);
            this.player1.clickCard(this.hebeTheHuge);
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickCard(this.bellowingPatrizate);
            this.player1.clickCard(this.kingOfTheCrag);
            this.player1.clickCard(this.brammo);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Yes');
            expect(this.groke.location).toBe('discard');
            expect(this.hebeTheHuge.location).toBe('discard');
            expect(this.gangerChieftain.location).toBe('discard');
            expect(this.bellowingPatrizate.location).toBe('discard');
            expect(this.kingOfTheCrag.location).toBe('discard');
            expect(this.brammo.location).toBe('discard');

            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.player.amber).toBe(0);
        });

        it('should allow key to be forged at [4] if 8 creatures are sacrificed', function () {
            this.player1.clickCard(this.obsidianForge);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Obsidian Forge');
            this.player1.clickCard(this.groke);
            this.player1.clickCard(this.hebeTheHuge);
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickCard(this.bellowingPatrizate);
            this.player1.clickCard(this.kingOfTheCrag);
            this.player1.clickCard(this.brammo);
            this.player1.clickCard(this.bingleBangbang);
            this.player1.clickCard(this.firespitter);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Yes');
            expect(this.groke.location).toBe('discard');
            expect(this.hebeTheHuge.location).toBe('discard');
            expect(this.gangerChieftain.location).toBe('discard');
            expect(this.bellowingPatrizate.location).toBe('discard');
            expect(this.kingOfTheCrag.location).toBe('discard');
            expect(this.brammo.location).toBe('discard');
            expect(this.firespitter.location).toBe('discard');
            expect(this.bingleBangbang.location).toBe('discard');

            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.player.amber).toBe(2);
        });

        it('should allow key to be forged using Soul Snatcher amber', function () {
            this.player1.player.optionSettings.orderForcedAbilities = false;
            this.player1.amber = 0;
            this.player1.moveCard(this.soulSnatcher, 'play area');

            this.player1.clickCard(this.obsidianForge);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Obsidian Forge');
            this.player1.clickCard(this.groke);
            this.player1.clickCard(this.hebeTheHuge);
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickCard(this.bellowingPatrizate);
            this.player1.clickCard(this.kingOfTheCrag);
            this.player1.clickCard(this.brammo);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Yes');
            expect(this.groke.location).toBe('discard');
            expect(this.hebeTheHuge.location).toBe('discard');
            expect(this.gangerChieftain.location).toBe('discard');
            expect(this.bellowingPatrizate.location).toBe('discard');
            expect(this.kingOfTheCrag.location).toBe('discard');
            expect(this.brammo.location).toBe('discard');

            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.player.amber).toBe(0);
        });
    });
});
