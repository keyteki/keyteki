describe('Redeemer Amara', function () {
    describe("Redeemer Amara's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    token: 'zealot',
                    hand: ['gateway-to-dis'],
                    inPlay: ['redeemer-amara', 'snarette', 'charette']
                },
                player2: {
                    amber: 1,
                    inPlay: ['rad-penny', 'old-bruno']
                }
            });

            this.redeemerAmara.ward();
        });

        it('should make a token for each destroyed mutant or enemy creature', function () {
            this.player1.play(this.gatewayToDis);
            this.player1.clickPrompt('Autoresolve');
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work on opponent turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.oldBruno, this.charette);
            this.player2.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(4);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
