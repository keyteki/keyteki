describe('Harmal Atoon', function () {
    describe("Harmal Atoon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['alaka', 'harmal-atoon', 'lamindra'],
                    hand: ['pound']
                },
                player2: {
                    inPlay: ['umbra', 'mega-alaka', 'bad-penny']
                }
            });
        });

        it('should give friendly Brobnar creatures on your turn Destroyed: return to hand', function () {
            this.player1.fightWith(this.alaka, this.megaAlaka);
            expect(this.alaka.location).toBe('hand');
            this.player1.play(this.pound);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            this.player1.fightWith(this.harmalAtoon, this.megaAlaka);
            expect(this.harmalAtoon.location).toBe('discard');
            this.player1.endTurn();
        });

        it("should give friendly Brobnar creatures on opponent's turn Destroyed: return to hand", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.megaAlaka, this.alaka);
            expect(this.alaka.location).toBe('hand');
            this.player2.endTurn();
        });

        it('should not give enemy Brobnar creatures any effects', function () {
            this.player1.fightWith(this.alaka, this.megaAlaka);
            this.player1.play(this.pound);
            expect(this.player1).toBeAbleToSelect(this.megaAlaka);
            this.player1.clickCard(this.megaAlaka);
            expect(this.megaAlaka.location).toBe('discard');
            this.player1.endTurn();
        });
    });
});
