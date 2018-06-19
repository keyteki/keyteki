describe('Bayushi Manipulator', function() {
    integration(function() {
        describe('Bayushi Manipulator\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        honor: 10,
                        inPlay: ['bayushi-manipulator'],
                        hand: []
                    },
                    player2: {
                        honor: 11,
                        hand: []
                    }
                });
            });

            it('should trigger when bids are revealed', function() {
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('bayushi-manipulator');
            });

            it('should change the amount of honor transfered and the number of cards drawn', function() {
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('1');
                this.player1.clickCard('bayushi-manipulator');
                expect(this.player1.player.honorBid).toBe(4);
                expect(this.player1.hand.length).toBe(4);
                expect(this.player1.player.honor).toBe(7);
                expect(this.player2.player.honorBid).toBe(1);
                expect(this.player2.hand.length).toBe(1);
                expect(this.player2.player.honor).toBe(14);
            });

            it('should not change the bidding dial', function() {
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('1');
                this.player1.clickCard('bayushi-manipulator');
                expect(this.player1.player.showBid).toBe(3);
            });
        });
    });
});
