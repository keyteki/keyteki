describe('Exo-shell System', function () {
    describe("Exo-shell System's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'grunt',
                    inPlay: ['grunt:clone-home', 'pelf', 'antiquities-dealer'],
                    hand: ['exo-shell-system']
                },
                player2: {
                    token: 'warrior',
                    inPlay: ['selwyn-the-fence', 'warrior:flaxia', 'bumpsy']
                }
            });
        });

        it('makes a token creature on play', function () {
            this.player1.play(this.exoShellSystem);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gives friendly tokens elusive', function () {
            this.player1.play(this.exoShellSystem);
            this.player1.clickPrompt('Right');
            this.player1.endTurn();
            this.grunt2 = this.player1.player.creaturesInPlay[2];

            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.warrior, this.grunt);
            expect(this.grunt.location).toBe('play area');
            expect(this.warrior.tokens.damage).toBe(undefined);

            this.player2.fightWith(this.bumpsy, this.pelf);
            expect(this.pelf.location).toBe('discard');
        });

        it('does not give enemy tokens elusive', function () {
            this.player1.play(this.exoShellSystem);
            this.player1.clickPrompt('Right');
            this.player1.fightWith(this.antiquitiesDealer, this.warrior);
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.warrior.tokens.damage).toBe(3);
        });
    });
});
