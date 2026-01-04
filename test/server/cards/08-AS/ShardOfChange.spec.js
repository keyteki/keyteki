describe('Shard of Change', function () {
    describe("Shard of Change's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['blypyp', 'way-of-the-pixie', 'airlock', 'the-circle-of-life'],
                    inPlay: ['shard-of-change'],
                    discard: [
                        'exchange-program',
                        'the-old-tinker',
                        'fortune-reverser',
                        'ornate-talking-tray',
                        'dust-pixie',
                        'shard-of-hate'
                    ]
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should swap with creatures from hand and discard', function () {
            this.player1.useAction(this.shardOfChange);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.wayOfThePixie);
            expect(this.player1).toBeAbleToSelect(this.airlock);
            expect(this.player1).toBeAbleToSelect(this.theCircleOfLife);
            this.player1.clickCard(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.theOldTinker);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.exchangeProgram);
            expect(this.player1).not.toBeAbleToSelect(this.fortuneReverser);
            expect(this.player1).not.toBeAbleToSelect(this.ornateTalkingTray);
            expect(this.player1).not.toBeAbleToSelect(this.shardOfHate);
            this.player1.clickCard(this.theOldTinker);
            expect(this.theOldTinker.location).toBe('hand');
            expect(this.blypyp.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should swap with upgrades from hand and discard', function () {
            this.player1.useAction(this.shardOfChange);
            this.player1.clickCard(this.wayOfThePixie);
            expect(this.player1).toBeAbleToSelect(this.fortuneReverser);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.exchangeProgram);
            expect(this.player1).not.toBeAbleToSelect(this.theOldTinker);
            expect(this.player1).not.toBeAbleToSelect(this.ornateTalkingTray);
            expect(this.player1).not.toBeAbleToSelect(this.shardOfHate);
            this.player1.clickCard(this.fortuneReverser);
            expect(this.fortuneReverser.location).toBe('hand');
            expect(this.wayOfThePixie.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should swap with artifacts from hand and discard', function () {
            this.player1.useAction(this.shardOfChange);
            this.player1.clickCard(this.airlock);
            expect(this.player1).not.toBeAbleToSelect(this.fortuneReverser);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.exchangeProgram);
            expect(this.player1).not.toBeAbleToSelect(this.theOldTinker);
            expect(this.player1).toBeAbleToSelect(this.ornateTalkingTray);
            expect(this.player1).toBeAbleToSelect(this.shardOfHate);
            this.player1.clickCard(this.ornateTalkingTray);
            expect(this.ornateTalkingTray.location).toBe('hand');
            expect(this.airlock.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should swap with actions from hand and discard', function () {
            this.player1.useAction(this.shardOfChange);
            this.player1.clickCard(this.theCircleOfLife);
            expect(this.player1).not.toBeAbleToSelect(this.fortuneReverser);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.exchangeProgram);
            expect(this.player1).not.toBeAbleToSelect(this.theOldTinker);
            expect(this.player1).not.toBeAbleToSelect(this.ornateTalkingTray);
            expect(this.player1).not.toBeAbleToSelect(this.shardOfHate);
            this.player1.clickCard(this.exchangeProgram);
            expect(this.exchangeProgram.location).toBe('hand');
            expect(this.theCircleOfLife.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to do it once per shard', function () {
            this.player1.moveCard(this.shardOfHate, 'play area');
            this.player1.useAction(this.shardOfChange);
            this.player1.clickCard(this.theCircleOfLife);
            this.player1.clickCard(this.exchangeProgram);
            expect(this.exchangeProgram.location).toBe('hand');
            expect(this.theCircleOfLife.location).toBe('discard');

            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.wayOfThePixie);
            expect(this.player1).toBeAbleToSelect(this.airlock);
            expect(this.player1).toBeAbleToSelect(this.exchangeProgram);
            this.player1.clickCard(this.blypyp);
            this.player1.clickCard(this.theOldTinker);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be optional once per shard', function () {
            this.player1.moveCard(this.shardOfHate, 'play area');
            this.player1.useAction(this.shardOfChange);
            this.player1.clickCard(this.theCircleOfLife);
            this.player1.clickCard(this.exchangeProgram);
            expect(this.exchangeProgram.location).toBe('hand');
            expect(this.theCircleOfLife.location).toBe('discard');

            this.player1.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing with no card matches', function () {
            this.player1.player.hand = [this.wayOfThePixie];
            this.player1.player.discard = [this.theOldTinker];
            this.player1.useAction(this.shardOfChange);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
