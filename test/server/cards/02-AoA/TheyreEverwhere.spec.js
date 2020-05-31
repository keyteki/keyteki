describe("They're Everywhere", function () {
    integration(function () {
        describe("They're Everywhere's ability", function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        hand: ['they-re-everywhere']
                    },
                    player2: {
                        inPlay: ['helper-bot', 'mooncurser', 'urchin', 'mindworm', 'symon']
                    }
                });
            });

            it('should cause a creature to fight, and then deal 2 damage to its neighbors', function () {
                this.player1.play(this.theyReEverywhere);
                expect(this.helperBot.location).toBe('discard');
                expect(this.mooncurser.location).toBe('play area');
                expect(this.urchin.location).toBe('discard');
                expect(this.mindworm.location).toBe('play area');
                expect(this.symon.location).toBe('discard');
            });
        });
    });
});
