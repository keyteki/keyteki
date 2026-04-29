describe('Requisition Writ', function () {
    describe("Requisition Writ's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['requisition-writ'],
                    inPlay: ['iron-heidy']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll', 'pelf', 'flaxia'],
                    discard: ['sir-marrows']
                }
            });
        });

        it('should pay opponent on reap', function () {
            this.player1.playUpgrade(this.requisitionWrit, this.ironHeidy);
            this.player1.reap(this.ironHeidy);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });

        it('should take control of an enemy creature on reap', function () {
            this.player1.playUpgrade(this.requisitionWrit, this.ironHeidy);
            this.player1.reap(this.ironHeidy);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.ironHeidy);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay).toContain(this.flaxia);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work on enemy creature', function () {
            this.player1.playUpgrade(this.requisitionWrit, this.flaxia);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');

            this.player2.reap(this.flaxia);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player2).not.toBeAbleToSelect(this.troll);
            expect(this.player2).not.toBeAbleToSelect(this.flaxia);
            expect(this.player2).toBeAbleToSelect(this.ironHeidy);
            this.player2.clickCard(this.ironHeidy);
            this.player2.clickPrompt('Right');
            expect(this.player2.player.creaturesInPlay).toContain(this.ironHeidy);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not work if you have no amber', function () {
            this.player2.moveCard(this.sirMarrows, 'play area');
            this.player1.amber = 0;
            this.player1.playUpgrade(this.requisitionWrit, this.ironHeidy);
            this.player1.reap(this.ironHeidy);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
