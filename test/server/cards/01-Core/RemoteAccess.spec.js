describe('Remote Access', function () {
    describe("Remote Access's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['masterplan', 'gateway-to-dis'],
                    inPlay: ['potion-of-invulnerability', 'sequis']
                },
                player2: {
                    amber: 2,
                    inPlay: ['brain-eater'],
                    hand: ['remote-access']
                }
            });
        });

        it('should correctly apply Potion of Invulnerability', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.remoteAccess);
            this.player2.clickCard(this.potionOfInvulnerability);
            expect(this.potionOfInvulnerability.location).toBe('discard');
            this.player2.fightWith(this.brainEater, this.sequis);
            expect(this.sequis.location).toBe('discard');
            expect(this.brainEater.hasToken('damage')).toBe(false);
        });

        it('should apply chains to the correct player when targeting Masterplan', function () {
            this.player1.play(this.masterplan);
            this.player1.clickCard(this.gatewayToDis);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.remoteAccess);
            this.player2.clickCard(this.masterplan);
            expect(this.masterplan.location).toBe('discard');
            expect(this.gatewayToDis.location).toBe('discard');
            expect(this.sequis.location).toBe('discard');
            expect(this.brainEater.location).toBe('discard');
            expect(this.player1.player.chains).toBe(0);
            expect(this.player2.player.chains).toBe(3);
        });
    });
});
