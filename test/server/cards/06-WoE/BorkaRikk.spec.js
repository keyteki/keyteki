describe('Borka Rikk', function () {
    describe("Borka Rikk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    token: 'grumpus',
                    hand: ['blypyp', 'kaboom', 'john-smyth', 'mindwarper', 'airlock', 'braindart'],
                    inPlay: ['borka-rikk', 'the-old-tinker'],
                    discard: ['umbra']
                },
                player2: {
                    hand: ['mind-barb', 'mindfire']
                }
            });
        });

        it('When a mars card is discarded by opponent, make a token creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.mindBarb);
            this.player2.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1.player.creaturesInPlay[0].name).toBe('Grumpus');
            this.expectReadyToTakeAction(this.player2);
        });

        it('When a mars card is discarded by self, make a token creature', function () {
            this.player1.clickCard(this.blypyp);
            this.player1.clickPrompt('Discard this card');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1.player.creaturesInPlay[0].name).toBe('Grumpus');
            this.expectReadyToTakeAction(this.player1);
        });

        it('When a non-mars card is discarded by self, nothing happens', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.moveCard(this.umbra, 'hand');
            this.player1.reap(this.theOldTinker);
            this.player1.clickCard(this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
