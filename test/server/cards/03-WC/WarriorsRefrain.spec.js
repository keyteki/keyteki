describe("Warriors' Refrain", function () {
    describe("Warriors' Refrain ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['warriors--refrain'],
                    inPlay: ['urchin', 'nexus', 'drummernaut', 'bingle-bangbang']
                },
                player2: {
                    inPlay: ['batdrone', 'mother', 'zorg']
                }
            });
        });

        it('should stun each creature with power 3 or lower', function () {
            this.player1.play(this.warriorsRefrain);
            expect(this.urchin.stunned).toBe(true);
            expect(this.nexus.stunned).toBe(true);
            expect(this.drummernaut.stunned).toBe(false);
            expect(this.bingleBangbang.stunned).toBe(true);
            expect(this.batdrone.stunned).toBe(true);
            expect(this.mother.stunned).toBe(false);
            expect(this.zorg.stunned).toBe(false);
        });
    });
});
