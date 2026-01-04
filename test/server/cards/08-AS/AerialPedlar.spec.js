describe('Aerial Pedlar', function () {
    describe("Aerial Pedlar's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    inPlay: ['aerial-pedlar']
                },
                player2: {
                    amber: 1,
                    inPlay: ['umbra', 'hunting-witch', 'flaxia']
                }
            });
        });

        it('should take control of and use least-powerful enemy creature', function () {
            this.player1.reap(this.aerialPedlar);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.aerialPedlar);
            this.player1.clickCard(this.umbra);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');

            this.player1.fightWith(this.umbra, this.aerialPedlar);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
            this.player1.endTurn();
            expect(this.aerialPedlar.exhausted).toBe(true);

            // You can't use it on the next turn.
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.player1).toHavePromptButton('shadows');
            this.player1.clickPrompt('ekwidon');
            this.player1.clickCard(this.umbra);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should take control of creatures bigger than itself', function () {
            this.player2.moveCard(this.umbra, 'discard');
            this.player2.moveCard(this.huntingWitch, 'discard');
            this.player1.reap(this.aerialPedlar);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Right');

            this.player1.reap(this.flaxia);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
