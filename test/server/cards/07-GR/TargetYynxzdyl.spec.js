describe('Target Yynxzdyl', function () {
    describe("Target Yynxzdyl's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['target-yynxzdyl', 'urchin'],
                    inPlay: ['troll'],
                    discard: [
                        'airlock',
                        'blypyp',
                        'mars-first',
                        'jammer-pack',
                        'mindwarper',
                        'umbra'
                    ]
                }
            });
        });

        it('should archive a card in discard on play', function () {
            this.player1.play(this.targetYynxzdyl);
            expect(this.player1).toHavePrompt('Target Yynxzdyl');
            expect(this.player1).toBeAbleToSelect(this.airlock);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.marsFirst);
            expect(this.player1).toBeAbleToSelect(this.jammerPack);
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.airlock);
            expect(this.airlock.location).toBe('archives');
            this.player1.endTurn();
        });

        it('should archive itself on reap', function () {
            this.player1.moveCard(this.targetYynxzdyl, 'play area');
            this.player1.reap(this.targetYynxzdyl);
            expect(this.targetYynxzdyl.location).toBe('archives');
            this.player1.endTurn();
        });
    });
});
