describe('Chummy', function () {
    describe("Chummy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['chummy'],
                    amber: 0,
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ]
                },
                player2: {
                    inPlay: ['krump', 'dew-faerie', 'briar-grubbling'],
                    amber: 3
                }
            });
        });

        it('should steal 1 amber when fighting the least powerful enemy creature', function () {
            this.player1.fightWith(this.chummy, this.dewFaerie);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should steal 1 amber when fighting the least powerful enemy creature when dying', function () {
            this.player1.fightWith(this.chummy, this.briarGrubbling);
            this.player1.clickCard(this.chummy);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.chummy.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal amber when fighting a more powerful enemy creature', function () {
            this.player1.fightWith(this.chummy, this.krump);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should pay 2 amber to opponent when fate is triggered', function () {
            this.player1.moveCard(this.chummy, 'hand');
            this.player1.activateProphecy(this.overreach, this.chummy);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.amber).toBe(2);
            expect(this.chummy.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
