describe('Echo Pearl', function () {
    describe("Echo Pearl's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'untamed',
                    inPlay: ['echo-pearl', 'hookmaster']
                },
                player2: {
                    amber: 5,
                    inPlay: ['nexus']
                }
            });

            this.player1.useOmni(this.echoPearl);
        });

        it('should be destroyed', function () {
            expect(this.echoPearl.location).toBe('discard');
        });

        it('should stun, exhaust and enrage a creature', function () {
            expect(this.player1).toBeAbleToSelect(this.hookmaster);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            this.player1.clickCard(this.nexus);
            expect(this.nexus.stunned).toBe(true);
            expect(this.nexus.exhausted).toBe(true);
            expect(this.nexus.enraged).toBe(true);
        });
    });
});
