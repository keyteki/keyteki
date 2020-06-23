describe('Stunner', function () {
    describe("Stunner's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['lieutenant-khrkhar'],
                    hand: ['stunner']
                },
                player2: {
                    inPlay: ['commander-remiel', 'bulwark', 'sequis']
                }
            });
        });

        it('should prompt for a target to stun on play', function () {
            this.player1.playUpgrade(this.stunner, this.lieutenantKhrkhar);
            this.player1.reap(this.lieutenantKhrkhar);
            expect(this.player1).toHavePrompt('Lieutenant Khrkhar');
            expect(this.player1).toBeAbleToSelect(this.lieutenantKhrkhar);
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            this.player1.clickCard(this.sequis);
            this.player1.clickPrompt('Yes');
            expect(this.sequis.stunned).toBe(true);
            expect(this.commanderRemiel.stunned).toBe(false);
            expect(this.bulwark.stunned).toBe(false);
            expect(this.lieutenantKhrkhar.stunned).toBe(false);
        });
        it('should be an optional choice', function () {
            this.player1.playUpgrade(this.stunner, this.lieutenantKhrkhar);
            this.player1.reap(this.lieutenantKhrkhar);
            expect(this.player1).toHavePrompt('Lieutenant Khrkhar');
            expect(this.player1).toBeAbleToSelect(this.lieutenantKhrkhar);
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            this.player1.clickPrompt('Done');
            expect(this.sequis.stunned).toBe(false);
            expect(this.commanderRemiel.stunned).toBe(false);
            expect(this.bulwark.stunned).toBe(false);
            expect(this.lieutenantKhrkhar.stunned).toBe(false);
        });
    });
});
