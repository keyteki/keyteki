describe('Cosmicrux', function () {
    describe("Cosmicrux's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['cosmicrux', 'troll']
                },
                player2: {
                    inPlay: ['charette']
                }
            });
        });

        it('should deal 1 damage to a creature when it readies', function () {
            this.troll.exhausted = true;
            this.player1.endTurn();
            expect(this.troll.damage).toBe(1);
            expect(this.cosmicrux.damage).toBe(0);
            expect(this.charette.damage).toBe(0);
        });

        it('should deal 1 damage to opponent creature when it readies', function () {
            this.charette.exhausted = true;
            this.player1.endTurn();
            this.player2.clickPrompt('Dis');
            this.player2.endTurn();
            expect(this.troll.damage).toBe(0);
            expect(this.cosmicrux.damage).toBe(0);
            expect(this.charette.damage).toBe(1);
        });

        it('should deal 1 damage to multiple creatures when they ready', function () {
            this.troll.exhausted = true;
            this.cosmicrux.exhausted = true;
            this.player1.endTurn();
            this.player1.clickCard(this.cosmicrux);
            expect(this.troll.damage).toBe(1);
            expect(this.cosmicrux.damage).toBe(1);
            expect(this.charette.damage).toBe(0);
        });
    });
});
