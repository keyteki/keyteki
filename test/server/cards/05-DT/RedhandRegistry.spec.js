describe('Redhand Registry', function () {
    describe("Redhand Registry's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    hand: ['dust-pixie', 'ronnie-wristclocks'],
                    inPlay: ['redhand-registry']
                },
                player2: {
                    amber: 1,
                    hand: ['gub', 'borrow', 'urchin']
                }
            });
        });

        describe('when opponent steal amber', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.amber = 10;
                this.player2.playCreature(this.urchin, true);
                expect(this.player2.amber).toBe(11);
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.endTurn();
            });

            it('should skip forge a key step', function () {
                expect(this.player2).not.toHavePrompt('Which key would you like to forge?');
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();
                expect(this.player2.amber).toBe(11);
            });

            describe('on their next turn', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('shadows');
                    this.player2.endTurn();
                    this.player1.clickPrompt('untamed');
                    this.player1.endTurn();
                });

                it('should be able to forge', function () {
                    this.player2.forgeKey('Red');
                    this.player2.clickPrompt('shadows');
                    this.player2.endTurn();
                    expect(this.player2.amber).toBe(5);
                });
            });
        });

        describe('when controller steal amber', function () {
            beforeEach(function () {
                this.player1.amber = 10;
                this.player2.amber = 10;
                this.player1.playCreature(this.ronnieWristclocks, true);
                this.player1.endTurn();
            });

            it('opponent should be able to forge on their turn', function () {
                this.player2.forgeKey('Red');
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();
                expect(this.player2.amber).toBe(2);
            });

            describe('and when in controller turn', function () {
                beforeEach(function () {
                    this.player2.forgeKey('Red');
                    this.player2.clickPrompt('shadows');
                    this.player2.endTurn();
                });

                it('should also be able to forge', function () {
                    this.player1.forgeKey('Red');
                    this.player1.clickPrompt('shadows');
                    this.player1.endTurn();
                    expect(this.player1.amber).toBe(6);
                });
            });
        });

        describe('when controlled by other player', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.play(this.borrow);
                this.player2.clickCard(this.redhandRegistry);
                this.player2.endTurn();
                this.player1.clickPrompt('shadows');
                this.player1.amber = 10;
                this.player1.play(this.ronnieWristclocks);
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
            });

            it('should skip forge a key step', function () {
                expect(this.player1).not.toHavePrompt('Which key would you like to forge?');
                this.player1.clickPrompt('shadows');
                this.player1.endTurn();
                expect(this.player1.amber).toBe(11);
            });
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'redhand-registry']
                },
                player2: {
                    amber: 5,
                    inPlay: [],
                    hand: ['urchin']
                }
            });
        });

        it("should affect opponent's next turn", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.urchin);
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.useAction(this.tachyonManifold);
            this.player1.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.player2.amber).toBe(6);
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
