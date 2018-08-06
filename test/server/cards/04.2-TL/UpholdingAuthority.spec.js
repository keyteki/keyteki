describe('Upholding Authority', function() {
    integration(function() {
        describe('Upholding Authority\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        hand: ['banzai', 'banzai', 'charge', 'court-games']
                    },
                    player2: {
                        provinces: ['upholding-authority']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker'],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
            });

            it('should trigger when it is broken', function() {
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('upholding-authority');
            });

            it('should prompt the player to choose a card', function() {
                this.upholdingAuthority = this.player2.clickCard('upholding-authority');
                expect(this.player2).toHavePrompt('Choose a card to discard');
                expect(this.player2.currentButtons).toContain('Charge!');
                expect(this.player2.currentButtons).toContain('Don\'t discard anything');
            });

            it('should not discard anything if the player clicks that option', function() {
                this.upholdingAuthority = this.player2.clickCard('upholding-authority');
                this.handSize = this.player1.hand.length;
                this.player2.clickPrompt('Don\'t discard anything');
                expect(this.player1.hand.length).toBe(this.handSize);
                expect(this.player1).toHavePrompt('Break Upholding Authority');
            });

            it('should discard the card if the player only has a single copy', function() {
                this.upholdingAuthority = this.player2.clickCard('upholding-authority');
                this.charge = this.player1.findCardByName('charge');
                this.player2.clickPrompt('Charge!');
                expect(this.charge.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Break Upholding Authority');
            });

            it('should ask the player how many cards to discard if the player picks a card with multiple copies', function() {
                this.upholdingAuthority = this.player2.clickCard('upholding-authority');
                this.banzai1 = this.player1.findCardByName('banzai');
                this.player2.clickPrompt('Banzai! (2)');
                expect(this.player2).toHavePrompt('Choose how many cards to discard');
                expect(this.player2.currentButtons).toContain('0');
                expect(this.player2.currentButtons).toContain('1');
                expect(this.player2.currentButtons).toContain('2');
            });

            it('should discard the correct number of cards if the player picks a card with multiple copies', function() {
                this.upholdingAuthority = this.player2.clickCard('upholding-authority');
                this.banzai = this.player1.findCardByName('banzai');
                this.player2.clickPrompt('Banzai! (2)');
                this.player2.clickPrompt('1');
                expect(this.banzai.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Break Upholding Authority');
            });
        });
    });
});
