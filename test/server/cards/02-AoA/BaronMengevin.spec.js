describe('Baron Mengevin', function () {
    describe("Baron Mengevin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    inPlay: ['baron-mengevin'],
                    hand: ['bulwark', 'batdrone']
                },
                player2: {
                    amber: 3,
                    hand: ['protectrix']
                }
            });
        });

        it('should capture 1 amber when discarding a Sanctum card from hand', function () {
            this.player1.clickPrompt('Sanctum');
            this.player1.clickCard(this.bulwark);
            this.player1.clickPrompt('Discard this card');
            expect(this.baronMengevin.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should capture amber when discarding a Sanctum enhanced card', function () {
            this.player1.clickPrompt('Logos');
            this.player1.scrap(this.batdrone);
            expect(this.baronMengevin.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not capture amber when discarding a non-Sanctum card', function () {
            this.batdrone.enhancements = ['sanctum'];
            this.player1.clickPrompt('Sanctum');
            this.player1.clickCard(this.batdrone);
            this.player1.clickPrompt('Discard this card');
            expect(this.baronMengevin.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should capture amber when opponent discards a Sanctum card', function () {
            this.player1.clickPrompt('Sanctum');
            this.player1.endTurn();
            this.player2.clickPrompt('Sanctum');
            this.player2.scrap(this.protectrix);
            expect(this.baronMengevin.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
