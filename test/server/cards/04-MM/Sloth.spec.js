describe('Sloth', function () {
    describe("Sloth's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['sloth', 'gub', 'desire', 'envy', 'pride', 'bad-penny', 'subtle-maul'],
                    hand: ['lamindra'],
                    amber: 1
                },
                player2: {
                    amber: 2,
                    inPlay: ['wrath']
                }
            });
        });

        it('should not gain any amber if a creature was used this turn', function () {
            this.player1.reap(this.badPenny);
            expect(this.player1.amber).toBe(2);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(2);
        });

        it('should gain amber if nothing was used this turn', function () {
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(5);
        });

        it('should gain amber if a card was played and artifact used', function () {
            this.player1.play(this.lamindra);
            this.player1.useAction(this.subtleMaul);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(5);
        });

        it("should not gain amber at the end of opponent's turn", function () {
            this.player1.endTurn();
            expect(this.player1.amber).toBe(5);
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            expect(this.player1.amber).toBe(5);
        });
    });
});
