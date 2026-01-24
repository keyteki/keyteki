describe('Kretchee', function () {
    describe("Kretchee's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'saurian',
                    inPlay: ['kretchee', 'citizen-shrix']
                },
                player2: {
                    amber: 3,
                    inPlay: ['snarette'],
                    hand: ['charette']
                }
            });
        });

        it('should add one amber when friendly creature exalts', function () {
            this.player1.reap(this.citizenShrix);
            expect(this.citizenShrix.amber).toBe(2);
            expect(this.player1.amber).toBe(8);
            expect(this.player2.amber).toBe(2);
        });

        it('should add one amber when enemy creature captures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.charette);
            expect(this.charette.amber).toBe(4);
            expect(this.player1.amber).toBe(3);
            this.player2.endTurn();
            expect(this.snarette.amber).toBe(2);
            expect(this.player1.amber).toBe(2);
        });
    });

    describe("Kretchee's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'brobnar',
                    inPlay: ['kretchee', 'alaka', 'senator-quintina'],
                    hand: ['kretchee']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should stack', function () {
            this.kretchee2 = this.player1.player.hand[0];
            this.player1.play(this.kretchee2);
            this.player1.reap(this.alaka);
            expect(this.alaka.amber).toBe(3);
            expect(this.player1.amber).toBe(7);
            expect(this.player2.amber).toBe(3);
        });
    });
});
