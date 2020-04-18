describe('Imperial Road', function() {
    integration(function() {
        describe('Imperial Road\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        inPlay: ['imperial-road'],
                        hand: ['flaxia', 'tantadlin', 'troll']
                    },
                    player2: {
                        amber: 1
                    }
                });
            });

            it('should not prompt for creature', function() {
                this.player1.useAction(this.imperialRoad, true);
                expect(this.player1).not.toHavePrompt('Choose a creature');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        describe('Imperial Road\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        inPlay: ['imperial-road', 'senator-shrix'],
                        discard: ['senator-bracchus'],
                        hand: ['flaxia', 'tantadlin', 'troll']
                    },
                    player2: {
                        amber: 1
                    }
                });
            });

            it('should not prompt for creature when there\'s none in hand (but are in discard or in play)', function() {
                this.player1.useAction(this.imperialRoad, true);
                expect(this.player1).not.toHavePrompt('Choose a creature');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
