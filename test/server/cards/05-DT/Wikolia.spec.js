describe('Wikolia', function () {
    describe("Wikolia's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'unfathomable',
                    inPlay: ['wikolia']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });
        });

        describe('after reap', function () {
            beforeEach(function () {
                this.player1.reap(this.wikolia);
            });

            it('opponent should forge a key paying 8A', function () {
                this.player2.amber = 8;
                this.player1.endTurn();
                this.player2.clickPrompt('red');
                expect(this.player2.amber).toBe(0);
            });

            describe('should last for a single turn', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.endTurn();
                    this.player1.clickPrompt('unfathomable');
                });

                it('should forge a key paying 8A', function () {
                    this.player2.amber = 6;
                    this.player1.endTurn();
                    this.player2.clickPrompt('red');
                    expect(this.player2.amber).toBe(0);
                });
            });
        });
    });
});
