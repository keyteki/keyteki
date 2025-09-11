describe('Skulking Saboteurs', function () {
    describe("Skulking Saboteurs's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['skulking-saboteurs', 'quixxle-stone']
                },
                player2: {
                    hand: ['bonecrusher'],
                    inPlay: ['troll', 'krump', 'gauntlet-of-command', 'library-of-babble']
                }
            });
        });

        it('should do nothing if no keys forged', function () {
            this.player1.reap(this.skulkingSaboteurs);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy an enemy creature if red key forged', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.reap(this.skulkingSaboteurs);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.skulkingSaboteurs);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy an enemy artifact if yellow key forged', function () {
            this.player1.player.keys = { red: false, blue: false, yellow: true };
            this.player1.reap(this.skulkingSaboteurs);
            expect(this.player1).toBeAbleToSelect(this.gauntletOfCommand);
            expect(this.player1).toBeAbleToSelect(this.libraryOfBabble);
            expect(this.player1).not.toBeAbleToSelect(this.quixxleStone);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.libraryOfBabble.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy an enemy upgrade if blue key forged', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.playUpgrade(this.bonecrusher, this.troll);
            this.player2.endTurn();
            this.player1.clickPrompt('skyborn');

            this.player1.player.keys = { red: false, blue: true, yellow: false };
            this.player1.reap(this.skulkingSaboteurs);
            expect(this.player1).toBeAbleToSelect(this.bonecrusher);
            this.player1.clickCard(this.bonecrusher);
            expect(this.bonecrusher.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy an enemy upgrade on friendly creature if blue key forged', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.playUpgrade(this.bonecrusher, this.skulkingSaboteurs);
            this.player2.endTurn();
            this.player1.clickPrompt('skyborn');

            this.player1.player.keys = { red: false, blue: true, yellow: false };
            this.player1.reap(this.skulkingSaboteurs);
            expect(this.player1).toBeAbleToSelect(this.bonecrusher);
            this.player1.clickCard(this.bonecrusher);
            expect(this.bonecrusher.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy an enemy creature and artifact if red and yellow keys are forged', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: true };
            this.player1.reap(this.skulkingSaboteurs);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.troll.location).toBe('discard');
            expect(this.libraryOfBabble.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy an enemy creature and upgrade if red and blue keys forged', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.playUpgrade(this.bonecrusher, this.troll);
            this.player2.endTurn();
            this.player1.clickPrompt('skyborn');

            this.player1.player.keys = { red: true, blue: true, yellow: false };
            this.player1.reap(this.skulkingSaboteurs);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.bonecrusher);
            expect(this.bonecrusher.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
