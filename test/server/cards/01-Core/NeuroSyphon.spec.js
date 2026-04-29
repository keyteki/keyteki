describe('Neuro Syphon', function () {
    describe("Neuro Syphon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['neuro-syphon']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should steal 1 amber and draw a card when opponent has more amber', function () {
            this.player1.play(this.neuroSyphon);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.hand.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing when player has equal amber after playing', function () {
            this.player1.amber = 1;
            this.player1.play(this.neuroSyphon);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing when player has more amber after playing', function () {
            this.player1.amber = 2;
            this.player1.play(this.neuroSyphon);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
