describe('Strange Shell', function () {
    describe("Strange Shell's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'strange-shell',
                    inPlay: ['strange-shell:antiquities-dealer']
                }
            });
        });

        it('should not be able to reap or fight', function () {
            expect(this.strangeShell.power).toBe(1);
            this.player1.clickCard(this.strangeShell);
            expect(this.player1).not.toHavePrompt('Reap with this Creature');
            expect(this.player1).not.toHavePrompt('Fight with this Creature');
        });

        it('should be able to return to hand', function () {
            this.player1.useAction(this.strangeShell);
            this.player1.playCreature(this.strangeShell);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player1.player.creaturesInPlay[0].name).toBe('Antiquities Dealer');
        });
    });

    describe('as artifact, returned to hand and played,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'strange-shell',
                    inPlay: ['strange-shell:puzzling-trinket']
                }
            });

            this.player1.useAction(this.strangeShell);
            this.puzzlingTrinket = this.player1.player.hand[0];

            this.player1.play(this.puzzlingTrinket);
            this.puzzlingTrinket.exhausted = false;
        });

        it('artifact should not have abilities', function () {
            this.player1.clickCard(this.puzzlingTrinket);

            expect(this.player1).not.toHavePrompt('Puzzling Trinket');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
