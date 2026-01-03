describe('Akugyo', function () {
    describe("Akugyo's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['akugyo']
                },
                player2: {
                    amber: 1,
                    hand: ['virtuous-works'],
                    inPlay: ['staunch-knight']
                }
            });
        });

        it('should capture opponent amber when the make it', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.reap(this.staunchKnight);
            expect(this.player2.amber).toBe(1);
            expect(this.akugyo.amber).toBe(1);
            this.player2.play(this.virtuousWorks);
            expect(this.player2.amber).toBe(1);
            expect(this.akugyo.amber).toBe(4);
            this.expectReadyToTakeAction(this.player2);
        });

        it('should move 2 amber to your pool on fight', function () {
            this.akugyo.amber = 4;
            this.player1.fightWith(this.akugyo, this.staunchKnight);
            expect(this.player1.amber).toBe(3);
            expect(this.akugyo.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should move 1 amber to your pool on fight if only 1', function () {
            this.akugyo.amber = 1;
            this.player1.fightWith(this.akugyo, this.staunchKnight);
            expect(this.player1.amber).toBe(2);
            expect(this.akugyo.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should do nothing if no amber on it', function () {
            this.player1.fightWith(this.akugyo, this.staunchKnight);
            expect(this.player1.amber).toBe(1);
            expect(this.akugyo.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
