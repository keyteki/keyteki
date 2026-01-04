describe('Tormented Badge', function () {
    describe("Tormented Badge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'redemption',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    inPlay: ['tormented-badge', 'ember-imp', 'troll', 'corrosive-monk']
                },
                player2: {
                    amber: 4,
                    inPlay: ['research-smoko', 'ancient-bear']
                }
            });
        });

        it('should take control of an enemy Mutant creature', function () {
            this.player1.useAction(this.tormentedBadge);
            expect(this.player1).toBeAbleToSelect(this.researchSmoko);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            expect(this.player1).not.toBeAbleToSelect(this.corrosiveMonk);
            this.player1.clickCard(this.researchSmoko);
            this.player1.clickPrompt('Right');
            expect(this.researchSmoko.controller).toBe(this.player1.player);
            expect(this.player1.player.creaturesInPlay).toContain(this.researchSmoko);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should give control of the most powerful friendly creature to opponent when fate is triggered', function () {
            this.player1.moveCard(this.tormentedBadge, 'hand');
            this.player1.activateProphecy(this.overreach, this.tormentedBadge);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.ancientBear);
            expect(this.player2).toBeAbleToSelect(this.ancientBear);
            expect(this.player2).not.toBeAbleToSelect(this.researchSmoko);
            expect(this.player2).not.toBeAbleToSelect(this.troll);
            this.player2.clickCard(this.ancientBear);
            this.player2.clickPrompt('Right');
            expect(this.ancientBear.controller).toBe(this.player1.player);
            expect(this.player1.player.creaturesInPlay).toContain(this.ancientBear);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
