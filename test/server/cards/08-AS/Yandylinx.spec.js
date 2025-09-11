describe('Yandylinx', function () {
    describe('reap ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['yandylinx'],
                    hand: ['blypyp']
                },
                player2: {
                    amber: 1,
                    inPlay: ['bot-bookton']
                }
            });
        });

        it('makes the opponent lose an amber when it discards a card', function () {
            this.player1.reap(this.yandylinx);
            expect(this.player1).toHavePrompt('Yandylinx');
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            this.player1.clickCard(this.blypyp);
            expect(this.blypyp.location).toBe('discard');
            expect(this.player2.amber).toBe(0);
        });

        it('does not make the opponent lose an amber when nothing is discarded', function () {
            this.player1.moveCard(this.blypyp, 'discard');
            this.player1.reap(this.yandylinx);
            expect(this.player2.amber).toBe(1);
        });
    });

    describe('scrap ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['blypyp', 'chuff-ape', 'mindwarper', 'brikk-nastee'],
                    hand: ['yandylinx']
                },
                player2: {
                    amber: 4,
                    inPlay: ['urchin']
                }
            });
        });

        it('captures onto each friendly Mars creature', function () {
            this.player1.scrap(this.yandylinx);
            expect(this.chuffApe.amber).toBe(1);
            expect(this.blypyp.amber).toBe(1);
            expect(this.mindwarper.amber).toBe(1);
            expect(this.brikkNastee.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.urchin.amber).toBe(0);
        });
    });
});
