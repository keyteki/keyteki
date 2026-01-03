describe('Niffle Sanctuary', function () {
    describe("Niffle Sanctuary's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    token: 'niffle-brute',
                    inPlay: ['niffle-sanctuary', 'niffle-brute:toad', 'chonkers']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'old-bruno']
                }
            });

            this.niffleBrute1 = this.player1.player.creaturesInPlay[0];
            this.niffleBrute2 = this.player1.player.deck[0];
        });

        it('should make a token creature on action', function () {
            this.player1.useAction(this.niffleSanctuary);
            this.player1.clickPrompt('Right');
            expect(this.niffleBrute2.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should give a fight ability to gain 1 amber for the rest of turn', function () {
            this.player1.useAction(this.niffleSanctuary);
            this.player1.clickPrompt('Right');
            this.player1.fightWith(this.niffleBrute1, this.lamindra);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            this.player1.fightWith(this.chonkers, this.lamindra);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.niffleBrute1, this.oldBruno);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
