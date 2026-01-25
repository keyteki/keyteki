describe('Enlist Numeri', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'saurian',
                inPlay: ['troll', 'shooler'],
                hand: ['enlist-numeri']
            },
            player2: {
                inPlay: ['urchin', 'bad-penny', 'knoxx']
            }
        });
    });

    describe('Playing it', function () {
        beforeEach(function () {
            this.urchin.amber = 1;
            this.player1.play(this.enlistNumeri);
        });

        it('should be able to select enemy creature with amber on it', function () {
            expect(this.urchin.amber).toBe(1);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.knoxx);
            expect(this.player1).not.toBeAbleToSelect(this.badPenny);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
        });

        describe('and then selecting a creature with amber on it', function () {
            beforeEach(function () {
                this.player1.clickCard(this.urchin);
                this.player1.clickPrompt('Left');
            });

            it('should take control of the creature', function () {
                expect(this.urchin.controller).toBe(this.player1.player);
            });

            it('should change the house of the controller creature to saurian', function () {
                expect(this.urchin.getHouses().includes('saurian')).toBe(true);
            });
        });
    });
});
