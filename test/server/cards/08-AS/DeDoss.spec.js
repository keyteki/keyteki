describe('De-Doss', function () {
    describe("De-Doss's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['de-doss', 'archimedes'],
                    inPlay: ['titan-guardian', 'helper-bot']
                },
                player2: {
                    hand: ['blood-of-titans', 'ganger-chieftain', 'krump']
                }
            });
        });

        it('prevents opponent from playing larger creatures, but not self', function () {
            this.player1.playUpgrade(this.deDoss, this.helperBot);
            this.player1.playCreature(this.archimedes);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.krump);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Discard this card');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does not prevent opponent from playing equal power creatures', function () {
            this.player1.playUpgrade(this.deDoss, this.titanGuardian);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.krump);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Discard this card');
            this.player2.playCreature(this.gangerChieftain);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('handles changes in power', function () {
            this.player1.playUpgrade(this.deDoss, this.titanGuardian);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.playUpgrade(this.bloodOfTitans, this.titanGuardian);
            this.player2.playCreature(this.krump);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
