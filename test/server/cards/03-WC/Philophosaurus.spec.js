describe('Philophosaurus', function() {
    integration(function() {
        describe('when reaped', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'saurian',
                        inPlay: ['philophosaurus'],
                        hand: ['shadow-self', 'urchin', 'titan-mechanic', 'brain-eater'],
                        amber: 4
                    },
                    player2: {
                        amber: 8,
                        inPlay: ['bumpsy']
                    }
                });

                this.player1.moveCard(this.titanMechanic, 'deck');
                this.player1.moveCard(this.urchin, 'deck');
                this.player1.moveCard(this.shadowSelf, 'deck');

                this.player1.reap(this.philophosaurus);
            });

            it('should prompt the top 3 cards from the deck', function() {
                expect(this.player1).toHavePromptCardButton(this.shadowSelf);
                expect(this.player1).toHavePromptCardButton(this.urchin);
                expect(this.player1).toHavePromptCardButton(this.titanMechanic);
            });

            describe('and a card is selected', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('urchin');
                });

                it('should move that card to archives', function() {
                    expect(this.urchin.location).toBe('archives');
                });

                it('should prompt the remaining two cards', function() {
                    expect(this.player1).toHavePromptCardButton(this.shadowSelf);
                    expect(this.player1).toHavePromptCardButton(this.titanMechanic);
                });

                describe('and a card is selected', function() {
                    beforeEach(function() {
                        this.player1.clickPrompt('shadow self');
                    });

                    it('should move that card to hand', function() {
                        expect(this.shadowSelf.location).toBe('hand');
                    });

                    it('should discard the remaning card', function() {
                        expect(this.titanMechanic.location).toBe('discard');
                    });
                });
            });
        });
    });
});
