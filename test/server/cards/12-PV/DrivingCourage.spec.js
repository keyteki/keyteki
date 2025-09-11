describe('Driving Courage', function () {
    describe("Driving Courage's ability", function () {
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
                    hand: ['driving-courage'],
                    inPlay: ['research-smoko', 'ember-imp', 'corrosive-monk']
                },
                player2: {
                    amber: 4,
                    inPlay: ['ancient-bear', 'fandangle', 'krump']
                }
            });
        });

        it('should ready and use a friendly Mutant creature', function () {
            this.player1.play(this.drivingCourage);
            expect(this.player1).toBeAbleToSelect(this.researchSmoko);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.corrosiveMonk);
            this.player1.clickCard(this.researchSmoko);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should exhaust each friendly non-Mutant creature when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.drivingCourage);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.ancientBear);
            expect(this.emberImp.exhausted).toBe(false);
            expect(this.corrosiveMonk.exhausted).toBe(false);
            expect(this.researchSmoko.exhausted).toBe(false);
            expect(this.fandangle.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(true);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
