describe('Revered Monk', function () {
    describe("Revered Monk's ability", function () {
        describe('with sanctum neighbors', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        hand: ['holdfast', 'gatekeeper', 'bulwark', 'troll'],
                        inPlay: ['revered-monk']
                    },
                    player2: {
                        inPlay: ['gub', 'krump']
                    }
                });
            });

            it('should get two armor for each sanctum neighbor', function () {
                this.player1.play(this.holdfast);
                expect(this.reveredMonk.armor).toBe(2);
                this.player1.play(this.gatekeeper, true);
                expect(this.reveredMonk.armor).toBe(4);
            });

            it('should stack its armor bonus with other armor enhancers', function () {
                this.player1.play(this.holdfast);
                this.player1.play(this.bulwark, true);
                expect(this.reveredMonk.armor).toBe(6);
            });
        });

        describe('with non-sanctum neibhors', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'brobnar',
                        hand: ['holdfast', 'gatekeeper', 'bulwark', 'troll'],
                        inPlay: ['revered-monk']
                    },
                    player2: {
                        inPlay: ['gub', 'krump']
                    }
                });
            });

            it('should get not an armor bonus for non-sanctum neighbors', function () {
                this.player1.play(this.troll);
                expect(this.reveredMonk.armor).toBe(0);
            });
        });
    });
});
