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
            this.troll.exhaust();
            this.player1.endTurn();
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.cosmicrux.tokens.damage).toBe(undefined);
            expect(this.charette.tokens.damage).toBe(undefined);
        });

        it('should deal 1 damage to opponent creature when it readies', function () {
            this.charette.exhaust();
            this.player1.endTurn();
            this.player2.clickPrompt('Dis');
            this.player2.endTurn();
            expect(this.troll.tokens.damage).toBe(undefined);
            expect(this.cosmicrux.tokens.damage).toBe(undefined);
            expect(this.charette.tokens.damage).toBe(1);
        });

        it('should deal 1 damage to multiple creatures when they ready', function () {
            this.troll.exhaust();
            this.cosmicrux.exhaust();
            this.player1.endTurn();
            this.player1.clickCard(this.cosmicrux);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.cosmicrux.tokens.damage).toBe(1);
            expect(this.charette.tokens.damage).toBe(undefined);
        });
    });
});
