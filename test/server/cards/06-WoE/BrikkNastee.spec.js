describe('BrikkNastee', function () {
    describe("BrikkNastee's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 1,
                    hand: ['bubbles'],
                    inPlay: ['flaxia', 'brikk-nastee', 'brammo']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'foozle']
                }
            });
        });

        it('confirm if brik fights no amber is earned', function () {
            expect(this.player1.amber).toBe(1);
            this.player1.fightWith(this.brikkNastee, this.gub);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
        });

        it('confirm if friendly brobnar fights 1 amber is earned', function () {
            expect(this.player1.amber).toBe(1);
            this.player1.fightWith(this.brammo, this.gub);
            expect(this.player1.amber).toBe(2);
            this.player1.endTurn();
        });

        it('confirm if friendly brobnar fights and dies 1 amber is earned', function () {
            expect(this.player1.amber).toBe(1);
            this.player1.fightWith(this.brammo, this.foozle);
            expect(this.brammo.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            this.player1.endTurn();
        });

        it('confirm if other non-brobnar fights no amber is earned', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            expect(this.player1.amber).toBe(1);
            this.player1.fightWith(this.flaxia, this.gub);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
        });

        it('confirm opponent brobnar fight does not earn amber', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.player2.amber).toBe(1);
            this.player2.fightWith(this.foozle, this.brammo);
            expect(this.player2.amber).toBe(1);
            this.player2.endTurn();
        });
    });
});
