describe('Xyp the Implanter', function () {
    describe("Xyp the Implanter's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    inPlay: ['xyp-the-implanter', 'flaxia']
                },
                player2: {
                    inPlay: ['troll', 'groggins', 'zizok']
                }
            });
        });

        it('takes control of an enemy creature', function () {
            this.player1.reap(this.xypTheImplanter);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.groggins);
            expect(this.player1).toBeAbleToSelect(this.zizok);
            expect(this.player1).not.toBeAbleToSelect(this.xypTheImplanter);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.zizok);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay).toContain(this.zizok);
        });

        it('destroys a friendly creature', function () {
            this.player1.reap(this.xypTheImplanter);
            this.player1.clickCard(this.zizok);
            this.player1.clickPrompt('Right');
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.groggins);
            expect(this.player1).toBeAbleToSelect(this.zizok);
            expect(this.player1).toBeAbleToSelect(this.xypTheImplanter);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('destroys a friendly creature without taking an enemy creature', function () {
            this.player2.moveCard(this.zizok, 'discard');
            this.player2.moveCard(this.troll, 'discard');
            this.player2.moveCard(this.groggins, 'discard');
            this.player1.reap(this.xypTheImplanter);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
