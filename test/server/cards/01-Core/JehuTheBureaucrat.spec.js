describe('Jehu the Bureaucrat', function () {
    describe("Jehu the Bureaucrat's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['jehu-the-bureaucrat', 'dextre']
                },
                player2: {
                    inPlay: ['troll', 'bulwark']
                }
            });
        });

        it('should gain 2 amber when Sanctum is chosen by controller', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.player1.amber).toBe(0);
            this.player1.clickPrompt('sanctum');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain amber when a different house is chosen by controller', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.player1.amber).toBe(0);
            this.player1.clickPrompt('logos');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain amber when opponent chooses Sanctum', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
