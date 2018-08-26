describe('Mobius Scroll', function() {
    integration(function() {
        describe('Mobius Scroll\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        inPlay: ['mobius-scroll'],
                        hand: ['batdrone', 'doc-bookton']
                    },
                    player2: {
                        inPlay: []
                    }
                });
            });

            it('should prompt to choose two cards from hand, and should allow choosing 0', function() {
                this.player1.clickCard(this.mobiusScroll);
                this.player1.clickPrompt('Use this card\'s Action ability');
                expect(this.player1).toHavePrompt('Mobius Scroll');
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                expect(this.mobiusScroll.location).toBe('archives');
            });

            it('should archive the cards', function() {
                this.player1.clickCard(this.mobiusScroll);
                this.player1.clickPrompt('Use this card\'s Action ability');
                this.player1.clickCard(this.batdrone);
                this.player1.clickCard(this.docBookton);
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                expect(this.mobiusScroll.location).toBe('archives');
                expect(this.batdrone.location).toBe('archives');
                expect(this.docBookton.location).toBe('archives');
            });
        });
    });
});
