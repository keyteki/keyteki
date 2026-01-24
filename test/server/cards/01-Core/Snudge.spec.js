describe('Snudge', function () {
    describe("Snudge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['snudge', 'urchin', 'krump', 'dominator-bauble']
                },
                player2: {
                    inPlay: [
                        'troll',
                        'dodger',
                        'batdrone',
                        'the-howling-pit',
                        'anomaly-exploiter',
                        'chaos-portal'
                    ]
                }
            });
        });

        it('should return a flank creature to hand after reap', function () {
            this.player1.reap(this.snudge);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Snudge');
            expect(this.player1).toBeAbleToSelect(this.snudge);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.dominatorBauble);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.theHowlingPit);
            expect(this.player1).toBeAbleToSelect(this.anomalyExploiter);
            expect(this.player1).toBeAbleToSelect(this.chaosPortal);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should return an artifact to hand after reap', function () {
            this.player1.reap(this.snudge);
            this.player1.clickCard(this.theHowlingPit);
            expect(this.theHowlingPit.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should return a flank creature to hand after fight', function () {
            this.player1.fightWith(this.snudge, this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).toHavePrompt('Snudge');
            expect(this.player1).toBeAbleToSelect(this.snudge);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.dominatorBauble);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.theHowlingPit);
            expect(this.player1).toBeAbleToSelect(this.anomalyExploiter);
            expect(this.player1).toBeAbleToSelect(this.chaosPortal);
            this.player1.clickCard(this.dodger);
            expect(this.dodger.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
