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
                    hand: [
                        'gauntlet-of-command',
                        'blood-money',
                        'bumpsy',
                        'blood-of-titans',
                        'ornar-skullface'
                    ]
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
            expect(this.player2).toHavePrompt('Archive?');
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
            expect(this.player2).toHavePrompt('Archive?');
            expect(this.player2).toHavePromptCardButton(this.gauntletOfCommand);
            expect(this.player2).toHavePromptButton('Discard');
            this.player2.clickPrompt('Discard');
            expect(this.gauntletOfCommand.location).toBe('discard');
        });

        it('allows opponent to resolve scrap', function () {
            this.player1.play(this.cornerTheMarket);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.ornarSkullface);
            this.player2.clickPrompt('Discard this card');
            expect(this.player2).toBeAbleToSelect(this.ornarSkullface);
            expect(this.player2).toHavePromptButton('Corner the Market');
            this.player2.clickCard(this.ornarSkullface);
            expect(this.player2).toBeAbleToSelect(this.troll);
            this.player2.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.player2).toHavePrompt('Archive?');
            expect(this.player2).toHavePromptCardButton(this.ornarSkullface);
            expect(this.player2).toHavePromptButton('Discard');
            this.player2.clickPrompt('Discard');
            expect(this.ornarSkullface.location).toBe('discard');
        });

        it('allows opponent to resolve scrap with archive', function () {
            this.player1.play(this.cornerTheMarket);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.ornarSkullface);
            this.player2.clickPrompt('Discard this card');
            expect(this.player2).toBeAbleToSelect(this.ornarSkullface);
            expect(this.player2).toHavePromptButton('Corner the Market');
            this.player2.clickCard(this.ornarSkullface);
            expect(this.player2).toBeAbleToSelect(this.troll);
            this.player2.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.player2).toHavePrompt('Archive?');
            expect(this.player2).toHavePromptCardButton(this.ornarSkullface);
            expect(this.player2).toHavePromptButton('Discard');
            this.player2.clickPrompt('Ornar Skullface');
            expect(this.ornarSkullface.location).toBe('archives');
        });
    });
    describe('its ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['corner-the-market']
                },
                player2: {
                    inPlay: ['the-old-tinker', 'subtle-maul'],
                    hand: ['auto-encoder', 'foggify']
                }
            });
        });
        it('does not interrupt the old tinker', function () {
            this.player1.play(this.cornerTheMarket);
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            expect(this.player2.hand.length).toBe(2);
            this.player2.reap(this.theOldTinker);
            this.player2.clickCard(this.autoEncoder);
            expect(this.autoEncoder.location).toBe('discard');
            expect(this.player2).toHavePrompt('Archive?');
            this.player2.clickPrompt('auto-encoder');
            expect(this.autoEncoder.location).toBe('archives');
            expect(this.player2.hand.length).toBe(2);
        });

        it('does not interrupt auto-encoder', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.autoEncoder);
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.play(this.cornerTheMarket);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            expect(this.player2.archives.length).toBe(0);
            this.player2.clickCard(this.foggify);
            this.player2.clickPrompt('Discard this card');
            expect(this.player2).toHavePrompt('Any reactions?');
            expect(this.player2).toBeAbleToSelect(this.autoEncoder);
            this.player2.clickCard(this.autoEncoder);
            expect(this.player2).toHavePromptCardButton(this.foggify);
            expect(this.player2).toHavePromptButton('Discard');
            this.player2.clickPrompt('foggify');
            expect(this.foggify.location).toBe('archives');
            expect(this.player2.archives.length).toBe(2);
        });

        it('does not prompt when discarding from opponents hand', function () {
            this.player1.play(this.cornerTheMarket);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.useAction(this.subtleMaul);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player2.hand.length).toBe(2);
            expect(this.player2.archives.length).toBe(0);
        });
    });
});
