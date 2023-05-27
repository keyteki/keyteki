describe('Weak Link', function () {
    describe("Weak Link's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    inPlay: ['seabringer-kekoa'],
                    hand: ['weak-link']
                },
                player2: {
                    amber: 1,
                    inPlay: ['flaxia']
                }
            });
        });

        describe('when played on own creature', function () {
            beforeEach(function () {
                this.player1.playUpgrade(this.weaklink, this.seabringerKekoa);
            });

            it('should not increase cost if creature is not exhausted', function () {});
        });

        describe("when played on opponent's creature", function () {
            beforeEach(function () {
                this.player1.playUpgrade(this.weaklink, this.seabringerKekoa);
            });

            it('should not increase cost if creature is not exhausted', function () {});
        });
    });
});
