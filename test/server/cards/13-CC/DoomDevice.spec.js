describe('Doom Device', function () {
    describe("Doom Device's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['doom-device', 'painmail', 'searine'],
                    inPlay: ['troll', 'krump', 'gub', 'ember-imp', 'snufflegator', 'brammo']
                },
                player2: {
                    inPlay: [
                        'mighty-tiger',
                        'hunting-witch',
                        'ancient-bear',
                        'helper-bot',
                        'library-of-babble'
                    ]
                }
            });
        });

        it('should destroy all creatures and artifacts when there are 13 or more cards in play at end of turn', function () {
            this.player1.play(this.doomDevice);
            this.player1.playCreature(this.searine);
            expect(this.doomDevice.location).toBe('play area');

            expect(this.game.cardsInPlay.length).toBe(13);

            this.player1.endTurn();

            // All creatures and artifacts should be destroyed
            expect(this.troll.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
            expect(this.snufflegator.location).toBe('discard');
            expect(this.brammo.location).toBe('discard');
            expect(this.mightyTiger.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.ancientBear.location).toBe('discard');
            expect(this.helperBot.location).toBe('discard');
            expect(this.libraryOfBabble.location).toBe('discard');
            expect(this.searine.location).toBe('discard');
            expect(this.doomDevice.location).toBe('discard');

            this.player2.clickPrompt('untamed');
        });

        it('should not destroy anything when there are fewer than 13 cards in play', function () {
            this.player1.play(this.doomDevice);
            expect(this.doomDevice.location).toBe('play area');

            expect(this.game.cardsInPlay.length).toBe(12);

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');

            // No creatures should be destroyed
            expect(this.troll.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.gub.location).toBe('play area');
            expect(this.emberImp.location).toBe('play area');
            expect(this.snufflegator.location).toBe('play area');
            expect(this.brammo.location).toBe('play area');
            expect(this.mightyTiger.location).toBe('play area');
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.ancientBear.location).toBe('play area');
            expect(this.helperBot.location).toBe('play area');
            expect(this.libraryOfBabble.location).toBe('play area');
            expect(this.doomDevice.location).toBe('play area');
        });

        it('should count upgrades as cards in play', function () {
            this.player1.play(this.doomDevice);
            this.player1.playUpgrade(this.painmail, this.troll);
            expect(this.doomDevice.location).toBe('play area');

            // Count total cards in play (but this doesn't count upgrades)
            expect(this.game.cardsInPlay.length).toBe(12);

            this.player1.endTurn();

            // All creatures and artifacts should be destroyed
            expect(this.troll.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
            expect(this.snufflegator.location).toBe('discard');
            expect(this.brammo.location).toBe('discard');
            expect(this.mightyTiger.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.ancientBear.location).toBe('discard');
            expect(this.helperBot.location).toBe('discard');
            expect(this.libraryOfBabble.location).toBe('discard');
            expect(this.painmail.location).toBe('discard');
            expect(this.doomDevice.location).toBe('discard');

            this.player2.clickPrompt('untamed');
        });
    });
});
