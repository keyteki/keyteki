describe('Explo-rover', function() {
    integration(function() {
        describe('Explo-rover creature/upgrade', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'staralliance',
                        hand: ['the-grim-reaper', 'explo-rover'],
                        inPlay: ['pingle-who-annoys']
                    },
                    player2: {
                        inPlay: ['umbra']
                    }
                });
            });

            it('other creatures can\'t be played as upgrades', function() {
                this.player1.clickCard(this.theGrimReaper);
                expect(this.player1.currentButtons.includes('Play this upgrade')).toBe(false);
            });
            it('is played as a creature that has skirmish', function() {
                this.player1.clickCard(this.exploRover);
                expect(this.player1.currentButtons.includes('Play this upgrade')).toBe(true);
                this.player1.play(this.exploRover);
                expect(this.exploRover.type).toBe('creature');
                expect(this.exploRover.location).toBe('play area');
                expect(this.exploRover.parent).toBe(null);
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();
                this.player1.clickPrompt('staralliance');
                this.player1.fightWith(this.exploRover, this.umbra);
                expect(this.exploRover.tokens.damage).toBe(undefined);
                expect(this.umbra.location).toBe('discard');
            });
            it('is played as an upgrade to grant skirmish', function() {
                this.player1.playUpgrade(this.exploRover, this.pingleWhoAnnoys);
                expect(this.exploRover.type).toBe('upgrade');
                expect(this.exploRover.location).toBe('play area');
                expect(this.exploRover.parent).toBe(this.pingleWhoAnnoys);
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();
                this.player1.clickPrompt('brobnar');
                this.player1.fightWith(this.pingleWhoAnnoys, this.umbra);
                expect(this.pingleWhoAnnoys.tokens.damage).toBe(undefined);
                expect(this.umbra.location).toBe('discard');
            });
        });
    });
});
