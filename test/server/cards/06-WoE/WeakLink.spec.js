describe('Weak Link', function () {
    describe("Weak Link's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    inPlay: ['seabringer-kekoa'],
                    hand: ['weak-link', 'call-of-the-void']
                },
                player2: {
                    amber: 1,
                    inPlay: ['flaxia']
                }
            });
        });

        describe('when played on own creature', function () {
            beforeEach(function () {
                this.player1.playUpgrade(this.weakLink, this.seabringerKekoa);
            });

            it('should not increase cost if creature is not exhausted', function () {
                expect(this.player1.player.getCurrentKeyCost()).toBe(6);
                expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            });

            it('should not increase own cost if creature is exhausted', function () {
                this.player1.reap(this.seabringerKekoa);
                expect(this.player1.player.getCurrentKeyCost()).toBe(12);
                expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            });
        });

        describe("when played on opponent's creature", function () {
            beforeEach(function () {
                this.player1.playUpgrade(this.weakLink, this.flaxia);
            });

            it('should not increase cost if creature is not exhausted', function () {
                expect(this.player1.player.getCurrentKeyCost()).toBe(6);
                expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            });

            it('should not increase opponent cost if creature is exhausted', function () {
                this.player1.play(this.callOfTheVoid);
                this.player1.clickCard(this.flaxia);
                expect(this.player1.player.getCurrentKeyCost()).toBe(6);
                expect(this.player2.player.getCurrentKeyCost()).toBe(12);
            });
        });
    });
});
