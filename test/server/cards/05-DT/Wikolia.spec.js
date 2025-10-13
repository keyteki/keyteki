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

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'unfathomable',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'wikolia']
                },
                player2: {
                    amber: 6,
                    inPlay: [],
                    hand: []
                }
            });
            this.tachyonManifold.maverick = 'unfathomable';
            this.tachyonManifold.printedHouse = 'unfathomable';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.reap(this.wikolia);
            this.player1.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player2.player.getCurrentKeyCost()).toBe(8);
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
