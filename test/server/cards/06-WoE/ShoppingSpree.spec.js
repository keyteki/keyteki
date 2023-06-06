describe('Shopping Spree', function () {
    describe("Shopping Spree's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    hand: [
                        'shopping-spree',
                        'pelf',
                        'bumpsy',
                        'antiquities-dealer',
                        'ikwijĭ-outpost'
                    ]
                }
            });
        });

        it('should discard whole hand', function () {
            this.player1.play(this.shoppingSpree);
            expect(this.player1.hand.length).toBe(4);
            expect(this.pelf.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.ikwijĭOutpost.location).toBe('discard');
        });

        it('should discard whole hand after playing some cards', function () {
            this.player1.playCreature(this.antiquitiesDealer);
            this.player1.play(this.ikwijĭOutpost);
            this.player1.play(this.shoppingSpree);
            expect(this.player1.hand.length).toBe(2);
            expect(this.pelf.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.antiquitiesDealer.location).toBe('play area');
            expect(this.ikwijĭOutpost.location).toBe('play area');
        });
    });
});
