describe('Backup Copy', function () {
    describe("Backup Copy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['batdrone'],
                    hand: ['backup-copy', 'positron-bolt']
                },
                player2: {
                    hand: ['gateway-to-dis']
                }
            });
        });

        it('should put the attached creature on top of deck when destroyed', function () {
            this.player1.playUpgrade(this.backupCopy, this.batdrone);
            this.player1.play(this.positronBolt);
            this.player1.clickCard(this.batdrone);
            expect(this.player1.player.deck[0]).toBe(this.batdrone);
            expect(this.player1).isReadyToTakeAction();
        });

        it("should put the attached creature on top of deck when destroyed during opponent's turn", function () {
            this.player1.playUpgrade(this.backupCopy, this.batdrone);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.gatewayToDis);
            expect(this.player1.player.deck[0]).toBe(this.batdrone);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
