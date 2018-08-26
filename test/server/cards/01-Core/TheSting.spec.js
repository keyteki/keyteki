describe('The Sting', function() {
    integration(function() {
        describe('The Sting\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        amber: 8,
                        hand: ['key-charge']
                    },
                    player2: {
                        amber: 6,
                        inPlay: ['the-sting']
                    }
                });
            });

            it('should skip the controllers key phase', function() {
                this.player1.clickPrompt('Done');
                expect(this.player2.amber).toBe(6);
                expect(this.player2.player.keys).toBe(0);
            });

            it('should cause the controller to receive oppponent\'s forging amber', function() {
                this.player1.play(this.keyCharge);
                this.player1.clickPrompt('Yes');
                expect(this.player1.amber).toBe(1);
                expect(this.player2.amber).toBe(12);
                expect(this.player1.player.keys).toBe(1);
            });

            it('should sacrifice when used', function() {
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('shadows');
                this.player2.clickCard(this.theSting);
                expect(this.player2).toHavePrompt('The Sting');
                this.player2.clickPrompt('Use this card\'s Action ability');
                expect(this.theSting.location).toBe('discard');
            });
        });
    });
});
