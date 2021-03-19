describe('UrienTheCircumspectEvilTwin', function () {
    describe('in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['urien-the-circumspect-evil-twin'],
                    hand: ['abond-the-armorsmith']
                },
                player2: {
                    amber: 4
                }
            });
        });

        describe('and reaps', function () {
            beforeEach(function () {
                this.player1.reap(this.urienTheCircumspectEvilTwin);
            });

            it('player2 should lose 1 A', function () {
                expect(this.player2.amber).toBe(3);
            });
        });

        describe('and reaps with additional armor', function () {
            beforeEach(function () {
                this.player1.play(this.abondTheArmorsmith);
                this.player1.reap(this.urienTheCircumspectEvilTwin);
            });

            it('player2 should lose 2 A', function () {
                expect(this.player2.amber).toBe(2);
            });
        });
    });
});
