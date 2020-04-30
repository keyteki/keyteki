describe('Wild Bounty', function() {
    integration(function() {
        describe('Wild Bounty\'s abilities', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        hand: ['fertility-chant', 'dust-pixie', 'wild-bounty']
                    },
                    player2: {
                        inPlay: ['troll', 'flaxia'],
                        amber: 2
                    }
                });
            });

            it('should not trigger twice before Wild Bounty is played', function() {
                this.player1.play(this.fertilityChant);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(4);
            });

            it('should trigger twice after Wild Bounty and resolve default bonus icons twice', function() {
                this.player1.play(this.wildBounty);
                this.player1.play(this.fertilityChant);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                expect(this.player1.amber).toBe(8);
                expect(this.player2.amber).toBe(4);
            });

            it('should reveal a card and apply enhanced bonus icons twice', function() {
                this.dustPixie.cardData.enhancements = ['amber', 'draw', 'damage'];
                this.player1.play(this.wildBounty);
                this.player1.play(this.dustPixie);
                expect(this.player1).toHavePrompt('Choose a creature to damage due to bonus icon');
                expect(this.player1).toBeAbleToSelect(this.flaxia);
                expect(this.player1).toBeAbleToSelect(this.troll);
                this.player1.clickCard(this.troll);
                expect(this.player1).toHavePrompt('Choose a creature to damage due to bonus icon');
                expect(this.player1).toBeAbleToSelect(this.flaxia);
                expect(this.player1).toBeAbleToSelect(this.troll);
                this.player1.clickCard(this.troll);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                expect(this.player1.amber).toBe(6);
                expect(this.player1.player.hand.length).toBe(3);
                expect(this.troll.tokens.damage).toBe(2);
                expect(this.player2.amber).toBe(2);
            });
        });
    });
});

