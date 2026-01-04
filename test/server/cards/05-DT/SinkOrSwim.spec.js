describe('Sink or Swim', function () {
    describe("when opponent's hand is empty and no creatures in play", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'unfathomable',
                    hand: ['sink-or-swim']
                },
                player2: {
                    amber: 4,
                    hand: []
                }
            });

            this.player1.play(this.sinkOrSwim);
        });

        it('should not prompt', function () {
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when owner hand is empty', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'unfathomable',
                    hand: ['sink-or-swim', 'dextre'],
                    inPlay: ['hookmaster']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens', 'lamindra', 'troll', 'fidgit']
                }
            });

            this.player1.play(this.sinkOrSwim);
        });

        it('should prompt to discard or exhaust', function () {
            expect(this.player1).toHavePromptButton('Random discard');
            expect(this.player1).toHavePromptButton('Exhaust');
        });

        describe('random is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Random discard');
            });

            it('should have no effect', function () {
                expect(this.player1.player.hand.length).toBe(1);
                expect(this.player2.player.hand.length).toBe(0);
            });
        });

        describe('when exhaust is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Exhaust');
            });

            it("should be able to select own's cards", function () {
                expect(this.player1).toBeAbleToSelect(this.hookmaster);
            });

            it("should be able to select opponent's cards", function () {
                expect(this.player1).toBeAbleToSelect(this.murkens);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.fidgit);
            });

            describe('when own creature without neighbors is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.hookmaster);
                });

                it('should exhaust it', function () {
                    expect(this.hookmaster.exhausted).toBe(true);
                    expect(this.lamindra.exhausted).toBe(false);
                    expect(this.troll.exhausted).toBe(false);
                    expect(this.murkens.exhausted).toBe(false);
                    expect(this.fidgit.exhausted).toBe(false);
                });
            });

            describe('when enemy creatures without neighbors is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.lamindra);
                });

                it('should exhaust it', function () {
                    expect(this.hookmaster.exhausted).toBe(false);
                    expect(this.lamindra.exhausted).toBe(true);
                    expect(this.murkens.exhausted).toBe(true);
                    expect(this.troll.exhausted).toBe(true);
                    expect(this.fidgit.exhausted).toBe(false);
                });
            });
        });
    });

    describe('when there is no creature in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'unfathomable',
                    hand: ['sink-or-swim', 'dextre']
                },
                player2: {
                    amber: 4,
                    hand: ['murkens', 'lamindra', 'troll', 'fidgit']
                }
            });

            this.player1.play(this.sinkOrSwim);
        });

        it('should prompt to discard or exhaust', function () {
            expect(this.player1).toHavePromptButton('Random discard');
            expect(this.player1).toHavePromptButton('Exhaust');
        });

        describe('random is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Random discard');
            });

            it("should discard from opponent's hand", function () {
                expect(this.player1.player.hand.length).toBe(1);
                expect(this.player2.player.hand.length).toBe(3);
            });
        });

        describe('when exhaust is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Exhaust');
            });

            it('should not prompt for creatures', function () {
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
