describe('Kudaka', function () {
    integration(function () {
        describe('Kudaka\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 2,
                        inPlay: ['kudaka'],
                        hand: ['seeker-of-knowledge'],
                        conflictDeck: ['fine-katana', 'watch-commander', 'favored-mount']
                    }
                });
                this.kudaka = this.player1.findCardByName('Kudaka', 'play area');
                this.noMoreActions();
            });

            it('should not trigger for non-air conflicts', function () {
                this.initiateConflict({
                    type: 'military',
                    ring: 'water',
                    attackers: ['kudaka'],
                    defenders: []
                });
                this.noMoreActions();
                // Discard card in province
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).not.toBeAbleToSelect(this.kudaka);
            });

            describe('when Seeker of Knowledge is present', function () {
                beforeEach(function () {
                    this.initiateConflict({
                        type: 'military',
                        ring: 'water',
                        attackers: ['kudaka'],
                        defenders: []
                    });
                    this.player2.pass();
                    this.seeker = this.player1.clickCard('seeker-of-knowledge', 'hand');
                    this.player1.clickPrompt('0');
                    this.player1.clickPrompt('Conflict');
                    this.noMoreActions();
                    // Discard card in province
                    this.player1.clickPrompt('Yes');
                });

                it('should trigger Kudaka\'s ability when air is selected', function () {
                    this.player1.clickRing('air');
                    this.player1.clickPrompt('Gain 2 Honor');
                    expect(this.player1).toBeAbleToSelect(this.kudaka);
                });

                it('should trigger Kudaka\'s ability when air is selected but not resolved', function () {
                    this.player1.clickRing('air');
                    this.player1.clickPrompt('Don\'t Resolve');
                    expect(this.player1).toBeAbleToSelect(this.kudaka);
                });

                it('should trigger Kudaka\'s ability when the original element is selected', function () {
                    this.player1.clickRing('water');
                    this.player1.clickCard(this.seeker);
                    expect(this.player1).toBeAbleToSelect(this.kudaka);
                });

                it('should trigger Kudaka\'s ability when the original element is selected but not resolved', function () {
                    this.player1.clickRing('water');
                    this.player1.clickPrompt('Don\'t Resolve');
                    expect(this.player1).toBeAbleToSelect(this.kudaka);
                });

                it('should trigger Kudaka\'s ability when no ring is resolved', function () {
                    this.player1.clickPrompt('Don\'t Resolve the Conflict Ring');
                    expect(this.player1).toBeAbleToSelect(this.kudaka);
                });
            });

            describe('when the ring of air is claimed', function () {
                beforeEach(function () {
                    this.initiateConflict({
                        type: 'military',
                        ring: 'air',
                        attackers: ['kudaka'],
                        defenders: []
                    });
                    this.noMoreActions();
                    // Discard card in province
                    this.player1.clickPrompt('Yes');
                    // Gain honor from air ring claim
                    this.player1.clickPrompt('Gain 2 Honor');
                });

                it('should prompt the player for reactions', function () {
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                });

                describe('when the player activates the reaction', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.kudaka);
                    });

                    it('should gain 1 fate', function () {
                        expect(this.player1.fate).toBe(3);
                    });

                    it('should draw 1 card', function () {
                        expect(this.player1.hand.length).toBe(2);
                    });
                });

            });
        });
    });
});
