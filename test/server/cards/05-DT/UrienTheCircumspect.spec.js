describe('UrienTheCircumspect', function () {
    describe('in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['urien-the-circumspect'],
                    hand: ['abond-the-armorsmith']
                }
            });
        });

        describe('and reaps', function () {
            beforeEach(function () {
                this.player1.reap(this.urienTheCircumspect);
            });

            it('should gain 1 + armor in A', function () {
                expect(this.player1.amber).toBe(2);
            });
        });

        describe('and reaps with additional armor', function () {
            beforeEach(function () {
                this.player1.play(this.abondTheArmorsmith);
                this.player1.reap(this.urienTheCircumspect);
            });

            it('should gain 1 + armor in A', function () {
                expect(this.player1.amber).toBe(3);
            });
        });
    });
});
