describe('Scylla', function () {
    describe("Scylla's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['scylla', 'galeatops', 'lamindra'],
                    amber: 2
                },
                player2: {
                    inPlay: ['brammo', 'alaka'],
                    amber: 3
                }
            });
        });

        it("should not affect owner's creatures", function () {
            this.player1.reap(this.galeatops);
            this.player1.reap(this.scylla);
            expect(this.player1.amber).toBe(4);
        });

        it('should cause 4 damage to enemy creatures after they reap', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.brammo);
            expect(this.player2.amber).toBe(4);
            expect(this.brammo.tokens.damage).toBe(3);
        });

        it('should not cause 4 damage to enemy creatures after they fight', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.brammo, this.lamindra);
            expect(this.brammo.tokens.damage).toBeUndefined();
        });
    });
});
