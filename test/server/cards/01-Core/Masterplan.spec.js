describe('Masterplan', function() {
    integration(function() {
        describe('Masterplan\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'shadows',
                        hand: ['masterplan', 'virtuous-works']
                    },
                    player2: {
                        inPlay: []
                    }
                });
            });

            it('should prompt the player to put a card underneath it when played', function() {
                this.player1.play(this.masterplan);
                expect(this.player1).toHavePrompt('Masterplan');
                this.player1.clickCard(this.virtuousWorks);
                expect(this.virtuousWorks.location).toBe('purged');
                expect(this.masterplan.childCards).toContain(this.virtuousWorks);

            });

            it('should play the card when clicked', function() {
                this.player1.play(this.masterplan);
                this.player1.clickCard(this.virtuousWorks);
                expect(this.player1.amber).toBe(1);
                this.masterplan.ready();
                this.player1.clickCard(this.masterplan);
                this.player1.clickPrompt('Use this card\'s Omni ability');
                expect(this.virtuousWorks.location).toBe('discard');
                expect(this.masterplan.childCards).not.toContain(this.virtuousWorks);
                expect(this.player1.amber).toBe(4);
            });
        });
    });
});
