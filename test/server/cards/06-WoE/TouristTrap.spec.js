describe('Tourist Trap', function () {
    describe("Tourist Trap's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'grunt',
                    inPlay: ['grunt:clone-home', 'pelf'],
                    hand: ['tourist-trap', 'mass-buyout']
                },
                player2: {
                    token: 'warrior',
                    inPlay: ['selwyn-the-fence', 'warrior:flaxia', 'bumpsy', 'troll']
                }
            });
        });

        it('makes a token creature on play', function () {
            this.player1.play(this.touristTrap);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Tourist Trap action's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'grunt',
                    inPlay: ['grunt:clone-home', 'picaroon', 'tourist-trap'],
                    hand: ['mass-buyout']
                },
                player2: {
                    token: 'warrior',
                    inPlay: ['selwyn-the-fence', 'warrior:flaxia', 'bumpsy', 'troll']
                }
            });
        });

        it('allows player to swap a token creature with opponent creature', function () {
            this.player1.useAction(this.touristTrap);
            expect(this.player1).toBeAbleToSelect(this.grunt);
            expect(this.player1).not.toBeAbleToSelect(this.picaroon);
            expect(this.player1).not.toBeAbleToSelect(this.selwynTheFence);
            expect(this.player1).not.toBeAbleToSelect(this.warrior);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.grunt);
            expect(this.player1).not.toBeAbleToSelect(this.grunt);
            expect(this.player1).not.toBeAbleToSelect(this.picaroon);
            expect(this.player1).toBeAbleToSelect(this.selwynTheFence);
            expect(this.player1).toBeAbleToSelect(this.warrior);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.bumpsy);
            this.player1.endTurn();

            expect(this.player1.player.creaturesInPlay[0]).toBe(this.bumpsy);
            expect(this.player1.player.creaturesInPlay[1]).toBe(this.picaroon);
            expect(this.player1.player.creaturesInPlay).not.toContain(this.grunt);
            expect(this.player2.player.creaturesInPlay).not.toContain(this.bumpsy);
            expect(this.player2.player.creaturesInPlay[0]).toBe(this.selwynTheFence);
            expect(this.player2.player.creaturesInPlay[1]).toBe(this.warrior);
            expect(this.player2.player.creaturesInPlay[2]).toBe(this.grunt);

            expect(this.bumpsy.owner).toBe(this.player2.player);
            expect(this.bumpsy.controller).toBe(this.player1.player);
            expect(this.grunt.owner).toBe(this.player1.player);
            expect(this.grunt.controller).toBe(this.player2.player);
        });

        it('does nothing if no creatures in play', function () {
            this.player1.play(this.massBuyout);
            this.player1.useAction(this.touristTrap);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
