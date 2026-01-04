describe('Fog Murmook', function () {
    describe("Fog Murmook's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'untamed',
                    inPlay: ['cephaloist', 'the-shadowsmith'],
                    hand: ['fog-murmook', 'dew-faerie']
                },
                player2: {
                    amber: 4,
                    inPlay: ['bull-wark', 'urchin']
                }
            });
        });

        it('should not reduce key cost when on a flank', function () {
            this.player1.play(this.fogMurmook);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should reduce key cost when not on a flank', function () {
            this.player1.play(this.fogMurmook);
            this.player1.play(this.dewFaerie);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
        });

        it('should not reduce opponent key cost when on a flank', function () {
            this.player2.amber = 5;
            this.player1.play(this.fogMurmook);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should reduce opponent key cost when not on a flank', function () {
            this.player2.amber = 5;
            this.player1.play(this.fogMurmook);
            this.player1.play(this.dewFaerie);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
        });
    });
});
