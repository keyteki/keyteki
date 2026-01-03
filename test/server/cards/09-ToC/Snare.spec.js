describe('Snare', function () {
    describe("Snare's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    token: 'snare',
                    inPlay: ['snare:toad', 'gub']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });

            this.snare = this.player1.player.creaturesInPlay[0];
        });

        it('should gain amber if destroyed on your turn', function () {
            this.player1.fightWith(this.snare, this.troll);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not gain amber if destroyed on your turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.snare);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
