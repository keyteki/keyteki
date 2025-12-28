describe('Gatekeeper', function () {
    describe("Gatekeeper's ability with 7+ amber", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['gatekeeper']
                },
                player2: {
                    amber: 9
                }
            });
        });

        it('should capture all but 5 amber when opponent has 7 or more', function () {
            this.player1.play(this.gatekeeper);
            expect(this.gatekeeper.amber).toBe(4);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Gatekeeper's ability with less than 7 amber", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['gatekeeper']
                },
                player2: {
                    amber: 6
                }
            });
        });

        it('should not capture amber when opponent has less than 7', function () {
            this.player1.play(this.gatekeeper);
            expect(this.gatekeeper.amber).toBe(0);
            expect(this.player2.amber).toBe(6);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Gatekeeper's ability with exactly 7 amber", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['gatekeeper']
                },
                player2: {
                    amber: 7
                }
            });
        });

        it('should capture 2 amber when opponent has exactly 7', function () {
            this.player1.play(this.gatekeeper);
            expect(this.gatekeeper.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
