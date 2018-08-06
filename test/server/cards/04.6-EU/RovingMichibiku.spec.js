describe('Roving Michibiku', function () {
    integration(function () {
        describe('Roving Michibiku\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['roving-michibiku', 'adept-of-the-waves']
                    },
                    player2: {
                        inPlay: ['kuni-yori', 'fire-tensai-initiate']
                    }
                });
                this.game.rings['water'].claimRing(this.player2);
                this.game.rings['fire'].claimRing(this.player1);
                this.adept = this.player1.findCardByName('adept-of-the-waves');
                this.roving = this.player1.findCardByName('roving-michibiku');
                this.kuni = this.player2.findCardByName('kuni-yori');
                this.fire = this.player2.findCardByName('fire-tensai-initiate');
                this.noMoreActions();
            });

            it('should trigger when the roving michibiku wins a conflict as the attacker', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.roving],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).toBeAbleToSelect(this.roving);
            });

            it('should not trigger when the roving michibiku wins a conflict as the defender', function () {
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.fire],
                    defenders: [this.roving]
                });
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.roving);
            });

            it('should not trigger when the roving michibiku loses a conflict', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.roving],
                    defenders: [this.kuni]
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger when a conflict is won that roving michibiku is not present at', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.adept],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.player1).toHavePrompt('Action Window');
            });

            describe('when it is triggered', function () {
                beforeEach(function () {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.roving],
                        defenders: []
                    });
                    this.noMoreActions();
                    this.player1.clickCard(this.roving);
                });

                it('should take a ring from the opponent\'s claimed pool', function () {
                    expect(this.player1).toHavePrompt('Choose a ring to take');
                    this.player1.clickRing('water');
                    expect(this.game.rings.water.claimedBy).toBe(this.player1.player.name);
                    this.player1.clickPrompt('Don\'t resolve');
                    expect(this.player1).toHavePrompt('Action Window');
                });

                it('should not be able to take from the unclaimed pool', function () {
                    expect(this.player1).toHavePrompt('Choose a ring to take');
                    this.player1.clickRing('earth');
                    expect(this.game.rings.earth.claimedBy).toBe('');
                    expect(this.player1).toHavePrompt('Choose a ring to take');
                });

                it('should not be able to take from the player\'s own claimed pool', function () {
                    expect(this.player1).toHavePrompt('Choose a ring to take');
                    this.player1.clickRing('fire');
                    expect(this.player1).toHavePrompt('Choose a ring to take');
                });
            });
        });
    });
});
