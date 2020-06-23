describe('Finch Cloak', function () {
    describe("Finch Cloak's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['a-vinda', 'mooncurser', 'tantadlin', 'finch-cloak']
                },
                player2: {
                    amber: 5,
                    inPlay: ['krump', 'nexus'],
                    hand: ['troll', 'groggins', 'groggins', 'groggins', 'groggins', 'groggins']
                }
            });
        });
        it('if P-A < O-A, it should steal one when reaping.', function () {
            this.player1.reap(this.finchCloak);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
        });
        it('if P-A < O-A, it should steal one when fighting.', function () {
            this.player1.fightWith(this.finchCloak, this.nexus);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });
        it('if P-A == O-A, it should give one to both when reaping.', function () {
            this.player1.amber = 2;
            this.player1.reap(this.finchCloak);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(4);
        });
        it('if P-A == O-A, it should give one to both when fighting.', function () {
            this.player1.amber = 5;
            this.player1.fightWith(this.finchCloak, this.nexus);
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(6);
        });
        it('if P-A > O-A, it should give one to both when reaping.', function () {
            this.player1.amber = 6;
            this.player1.reap(this.finchCloak);
            expect(this.player1.amber).toBe(8);
            expect(this.player2.amber).toBe(6);
        });
        it('if P-A > O-A, it should give one to both when fighting.', function () {
            this.player1.amber = 6;
            this.player1.fightWith(this.finchCloak, this.nexus);
            expect(this.player1.amber).toBe(7);
            expect(this.player2.amber).toBe(6);
        });
    });
});
