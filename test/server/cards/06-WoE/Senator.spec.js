describe('Senator', function () {
    describe("Senator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    token: 'senator',
                    inPlay: ['senator:curia-saurus']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });
        });

        describe('after action', function () {
            beforeEach(function () {
                this.player1.useAction(this.senator);
            });

            it('opponent should forge a key paying 7A', function () {
                this.player2.amber = 7;
                this.player1.endTurn();
                this.player2.forgeKey('Red');
                expect(this.player2.amber).toBe(0);
            });

            describe('should last for a single turn', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.endTurn();
                    this.player1.clickPrompt('saurian');
                });

                it('should forge a key paying 7A', function () {
                    this.player2.amber = 6;
                    this.player1.endTurn();
                    this.player2.forgeKey('Red');
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
                    house: 'saurian',
                    token: 'senator',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'senator:curia-saurus']
                },
                player2: {
                    amber: 6,
                    inPlay: [],
                    hand: []
                }
            });
            this.tachyonManifold.maverick = 'saurian';
            this.tachyonManifold.printedHouse = 'saurian';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.useAction(this.senator);
            this.player1.endTurn();
            this.player1.clickPrompt('saurian');
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player2.player.getCurrentKeyCost()).toBe(7);
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
