describe('Armored Spikes', function () {
    describe("Armored Spikes's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['armored-spikes'],
                    inPlay: ['dew-faerie', 'fandangle']
                },
                player2: {
                    inPlay: ['rowdy-skald']
                }
            });
        });

        it('should give +2 armor', function () {
            this.player1.playUpgrade(this.armoredSpikes, this.fandangle);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.rowdySkald, this.fandangle);
            expect(this.fandangle.tokens.damage).toBe(2);
            this.expectReadyToTakeAction(this.player2);
        });

        it('should give hazardous 2', function () {
            this.player1.playUpgrade(this.armoredSpikes, this.dewFaerie);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.rowdySkald, this.dewFaerie);
            expect(this.rowdySkald.tokens.damage).toBe(2);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
