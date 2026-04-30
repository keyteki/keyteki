describe('Kaipo', function () {
    describe("Kaipo's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['urchin', 'kaipo', 'silvertooth']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it("fully heals each of Kaipo's neighbors at the end of the turn", function () {
            this.urchin.tokens.damage = 1;
            this.silvertooth.tokens.damage = 2;
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.urchin.damage).toBe(0);
            expect(this.silvertooth.damage).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not heal non-neighbors', function () {
            this.troll.tokens.damage = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.troll.damage).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not trigger on opponent end of turn', function () {
            this.urchin.tokens.damage = 1;
            this.silvertooth.tokens.damage = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            // damage healed at end of player1's turn
            expect(this.urchin.damage).toBe(0);
            expect(this.silvertooth.damage).toBe(0);
            // Now damage them again and end player2's turn -- should NOT heal
            this.urchin.tokens.damage = 1;
            this.silvertooth.tokens.damage = 1;
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.urchin.damage).toBe(1);
            expect(this.silvertooth.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
