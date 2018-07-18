describe('Master of the Swift Waves', function() {
    integration(function() {
        describe('Master of the Swift Waves\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['master-of-the-swift-waves', 'matsu-berserker','shinjo-shono']
                    },
                    player2: {
                        inPlay: ['venerable-historian']
                    }
                });

                this.swift = this.player1.findCardByName('master-of-the-swift-waves');
                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.shono = this.player1.findCardByName('shinjo-shono');

                this.historian = this.player2.findCardByName('venerable-historian');

                this.noMoreActions();
            });

            it('should correctly target participating characters', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.swift],
                    defenders: [this.historian]
                });
                this.player2.pass();
                this.player1.clickCard(this.swift);
                expect(this.player1).toHavePrompt('Choose a participating character to send home');
                expect(this.player1).not.toBeAbleToSelect(this.berserker);
                expect(this.player1).not.toBeAbleToSelect(this.historian);
                expect(this.player1).not.toBeAbleToSelect(this.shono);
                expect(this.player1).toBeAbleToSelect(this.swift);
            });

            it('should correctly target home characters', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.swift],
                    defenders: [this.historian]
                });
                this.player2.pass();
                this.player1.clickCard(this.swift);
                this.player1.clickCard(this.swift);
                expect(this.player1).toHavePrompt('Choose a character to move to the conflict');
                expect(this.player1).not.toBeAbleToSelect(this.swift);
                expect(this.player1).not.toBeAbleToSelect(this.historian);
                expect(this.player1).toBeAbleToSelect(this.shono);
                expect(this.player1).not.toBeAbleToSelect(this.berserker);
            });

            it('should correctly switch characters', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.swift],
                    defenders: [this.historian]
                });
                this.player2.pass();
                this.player1.clickCard(this.swift);
                this.player1.clickCard(this.swift);
                this.player1.clickCard(this.shono);
                expect(this.shono.inConflict).toBe(true);
                expect(this.swift.inConflict).toBe(false);
            });

            it('should not trigger without valid targets', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.swift,this.shono],
                    defenders: [this.historian]
                });
                this.player2.pass();
                this.player1.clickCard(this.swift);
                expect(this.player1).not.toHavePromptButton('Choose a participating character to send home');
            });

        });
    });
});
