describe('Contract Execution', function () {
    describe("Contract Execution's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: [
                        'contract-execution',
                        'gemcoat-vendor',
                        'the-old-tinker',
                        'ornate-talking-tray'
                    ],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['troll', 'flaxia']
                }
            });
        });

        it('should deal 2 damage on each creature player', function () {
            this.player1.play(this.contractExecution);
            this.player1.playCreature(this.gemcoatVendor);
            expect(this.player1).toBeAbleToSelect(this.gemcoatVendor);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);

            this.player1.play(this.ornateTalkingTray);
            this.expectReadyToTakeAction(this.player1);

            this.player1.playCreature(this.theOldTinker);
            this.player1.clickCard(this.gemcoatVendor);
            expect(this.gemcoatVendor.tokens.damage).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
