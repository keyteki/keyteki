describe('The Grand Gord', function () {
    describe("The Grand Gord's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['batdrone'],
                    hand: ['bumpsy', 'troll']
                },
                player2: {
                    token: 'warrior',
                    inPlay: ['the-grand-gord']
                }
            });
        });

        it('should make a token creature for having biggest creature', function () {
            expect(this.player2.player.creaturesInPlay.length).toBe(1);
            this.player1.endTurn();

            this.player2.clickPrompt('Right');
            expect(this.player2.player.creaturesInPlay.length).toBe(2);
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should make a token creature for being tied for having biggest creature', function () {
            expect(this.player2.player.creaturesInPlay.length).toBe(1);
            this.player1.playCreature('bumpsy');
            this.player1.endTurn();

            this.player2.clickPrompt('Right');
            expect(this.player2.player.creaturesInPlay.length).toBe(2);
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not make a token creature for not having biggest creature', function () {
            expect(this.player2.player.creaturesInPlay.length).toBe(1);
            this.player1.playCreature('troll');
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            expect(this.player2.player.creaturesInPlay.length).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
