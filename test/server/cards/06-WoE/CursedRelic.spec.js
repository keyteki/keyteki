describe('Cursed Relic', function () {
    describe('its ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['cursed-relic'],
                    inPlay: ['the-old-tinker']
                },
                player2: {
                    inPlay: ['troll'],
                    hand: ['blossom-drake']
                }
            });
        });

        it('prevents it from being played', function () {
            this.player1.clickCard(this.cursedRelic);
            expect(this.player1).not.toHavePrompt('Play this artifact');
            expect(this.player1).not.toHavePrompt('Discard');
        });

        it('is not blanked by Blossom Drake', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.blossomDrake);
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.clickCard(this.cursedRelic);
            expect(this.player1).not.toHavePrompt('Play this artifact');
            expect(this.player1).not.toHavePrompt('Discard');
        });

        it('can be discarded through card abilitis', function () {
            this.player1.reap(this.theOldTinker);
            this.player1.clickCard(this.cursedRelic);
            expect(this.cursedRelic.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
