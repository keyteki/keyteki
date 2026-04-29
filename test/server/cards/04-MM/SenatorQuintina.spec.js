describe('Senator Quintina', function () {
    describe('Senator Quintina', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 2,
                    inPlay: ['senator-quintina', 'citizen-shrix']
                },
                player2: {
                    amber: 0,
                    inPlay: ['troll', 'grenade-snib'],
                    hand: ['bulwark']
                }
            });
        });

        it('exalts a creature after is reaps', function () {
            this.player1.reap(this.citizenShrix);
            this.player1.clickCard(this.citizenShrix);
            expect(this.citizenShrix.amber).toBe(2);

            this.player1.reap(this.senatorQuintina);
            expect(this.senatorQuintina.amber).toBe(1);
        });

        it("exalts an opponent's creature after it reaps", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.troll);
            this.player2.clickCard(this.troll);

            expect(this.troll.amber).toBe(1);
        });
    });
});
