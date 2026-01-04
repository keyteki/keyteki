describe('Ember Imp', function () {
    describe("Ember Imp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['bulleteye'],
                    hand: ['umbra', 'urchin', 'dodger']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
        });

        it('should limit opponent to 2 card plays per turn', function () {
            this.player1.play(this.umbra);
            this.player1.play(this.urchin);
            this.player1.clickCard(this.dodger);
            expect(this.player1).not.toHavePromptButton('Play this creature');
            expect(this.player1).toHavePromptButton('Discard this card');
            this.player1.clickPrompt('Cancel');
            this.player1.fightWith(this.bulleteye, this.emberImp);
            this.player1.play(this.dodger);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
