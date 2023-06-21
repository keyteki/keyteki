describe('GenerousOffer,', function () {
    describe('on play with a friendly creature,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    hand: ['bubbles', 'generous-offer'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub', 'krump']
                }
            });

            this.player1.play(this.generousOffer);
        });

        it('should prompt to destroy a friendly creature', function () {
            expect(this.player1).toHavePrompt('Generous Offer');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
        });

        describe('when a creature is selected,', function () {
            beforeEach(function () {
                this.player1.clickCard(this.flaxia);
            });

            it('should destroy it', function () {
                this.player1.clickCard(this.flaxia);
                expect(this.flaxia.location).toBe('discard');
            });

            it('should steal 2 amber', function () {
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(1);
            });
        });
    });

    describe('on play without a friendly creature,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    hand: ['bubbles', 'generous-offer'],
                    inPlay: []
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub', 'krump']
                }
            });

            this.player1.play(this.generousOffer);
        });

        it('should do nothing', function () {
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });
    });
});
