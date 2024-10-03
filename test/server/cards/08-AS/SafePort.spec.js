describe('Safe Port', function () {
    describe("Safe Port's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['safe-port'],
                    inPlay: ['dust-pixie', 'hunting-witch']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should do nothing if no yellow keys forged', function () {
            this.player1.play(this.safePort);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should capture 2 if your yellow key forged', function () {
            this.player1.player.keys = { blue: false, red: false, yellow: true };
            this.player1.play(this.safePort);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.dustPixie.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should steal 1 if their yellow key forged', function () {
            this.player2.player.keys = { blue: false, red: false, yellow: true };
            this.player1.play(this.safePort);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should do both if both yellow keys forged', function () {
            this.player1.player.keys = { blue: false, red: false, yellow: true };
            this.player2.player.keys = { blue: false, red: false, yellow: true };
            this.player1.play(this.safePort);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.dustPixie.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should only steal if both yellow keys forged but no friendly creatures', function () {
            this.player1.player.keys = { blue: false, red: false, yellow: true };
            this.player2.player.keys = { blue: false, red: false, yellow: true };
            this.player1.moveCard(this.dustPixie, 'discard');
            this.player1.moveCard(this.huntingWitch, 'discard');
            this.player1.play(this.safePort);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
