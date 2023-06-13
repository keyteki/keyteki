describe('Corner the Market', function () {
    describe('its ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['corner-the-market', 'antiquities-dealer']
                },
                player2: {
                    inPlay: ['troll'],
                    hand: ['gauntlet-of-command', 'blood-money', 'bumpsy', 'blood-of-titans']
                }
            });
        });

        it('stops opponent from playing cards next turn', function () {
            this.player1.play(this.cornerTheMarket);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.gauntletOfCommand);
            expect(this.player2).not.toHavePrompt('Play this artifact');
            this.player2.clickPrompt('Cancel');
            this.player2.clickCard(this.bloodMoney);
            expect(this.player2).not.toHavePrompt('Play this action');
            this.player2.clickPrompt('Cancel');
            this.player2.clickCard(this.bumpsy);
            expect(this.player2).not.toHavePrompt('Play this creature');
            this.player2.clickPrompt('Cancel');
            this.player2.clickCard(this.bloodOfTitans);
            expect(this.player2).not.toHavePrompt('Play this upgrade');
            this.player2.clickPrompt('Cancel');
        });

        it('only lasts one turn', function () {
            this.player1.play(this.cornerTheMarket);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.gauntletOfCommand);
            expect(this.player2).not.toHavePrompt('Play this artifact');
            this.player2.clickPrompt('Cancel');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.play(this.antiquitiesDealer);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.gauntletOfCommand);
            expect(this.gauntletOfCommand.location).toBe('play area');
        });

        it('allows opponent to archive instead of discard', function () {
            this.player1.play(this.cornerTheMarket);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.gauntletOfCommand);
            this.player2.clickPrompt('Discard this card');
            expect(this.player2).toHavePrompt('Archive instead?');
            expect(this.player2).toHavePromptCardButton(this.gauntletOfCommand);
            expect(this.player2).toHavePromptButton('Discard');
            this.player2.clickPrompt('gauntlet of command');
            expect(this.gauntletOfCommand.location).toBe('archives');
        });

        it('allows opponent to discard if desired', function () {
            this.player1.play(this.cornerTheMarket);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.gauntletOfCommand);
            this.player2.clickPrompt('Discard this card');
            expect(this.player2).toHavePrompt('Archive instead?');
            expect(this.player2).toHavePromptCardButton(this.gauntletOfCommand);
            expect(this.player2).toHavePromptButton('Discard');
            this.player2.clickPrompt('Discard');
            expect(this.gauntletOfCommand.location).toBe('discard');
        });
    });
});
