describe('Distant Void Prober', function () {
    describe("Distant Void Prober's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['blypyp'],
                    inPlay: ['distant-void-prober', 'mindwarper'],
                    discard: new Array(9).fill('poke') // not haunted
                },
                player2: {
                    inPlay: ['urchin'],
                    amber: 10
                }
            });
        });

        it('should not increase key cost +3 if not haunted', function () {
            this.player1.reap(this.distantVoidProber);
            this.player1.endTurn();
            this.player2.clickPrompt('red');
            expect(this.player2.amber).toBe(4);
        });

        it('should increase key cost +3 if haunted', function () {
            this.player1.clickCard(this.blypyp);
            this.player1.clickPrompt('Discard this card');
            this.player1.reap(this.distantVoidProber);
            this.player1.endTurn();
            this.player2.clickPrompt('red');
            expect(this.player2.amber).toBe(1);
        });

        it("should prompt for an opponent's creature and have it capture it's controller's amber", function () {
            this.player1.moveCard(this.distantVoidProber, 'hand');
            this.player1.scrap(this.distantVoidProber);
            expect(this.player1).toHavePrompt('Distant Void Prober');
            expect(this.player1).not.toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.urchin);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(9);
            expect(this.urchin.tokens.amber).toBe(1);
        });
    });
});
