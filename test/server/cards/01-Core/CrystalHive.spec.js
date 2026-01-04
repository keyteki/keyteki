describe('Crystal Hive', function () {
    describe("Crystal Hive's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['crystal-hive', 'mindwarper']
                },
                player2: {}
            });
        });

        it('should gain 1 extra amber after using Crystal Hive action', function () {
            this.player1.useAction(this.crystalHive);
            this.player1.reap(this.mindwarper);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain extra amber before using Crystal Hive action', function () {
            this.player1.reap(this.mindwarper);
            this.player1.useAction(this.crystalHive);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
