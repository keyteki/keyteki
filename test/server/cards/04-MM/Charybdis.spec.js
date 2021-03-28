describe('Charybdis', function () {
    describe("Charybdis's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['charybdis', 'galeatops'],
                    amber: 2
                },
                player2: {
                    inPlay: ['troll', 'alaka'],
                    amber: 3
                }
            });
        });

        it('owner of charybdis should not lose 1A', function () {
            this.player1.fightWith(this.galeatops, this.troll);
            expect(this.player1.amber).toBe(2);
        });

        it('opponent should lose 1A before fight', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.galeatops);
            this.player2.fightWith(this.alaka, this.charybdis);
            expect(this.alaka.location).toBe('discard');
            expect(this.player2.amber).toBe(1);
        });
    });
});
