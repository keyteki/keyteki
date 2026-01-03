describe('Tomwa of the Glow Evil Twin', function () {
    describe("Tomwa of the Glow Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'unfathomable',
                    inPlay: ['tomwa-of-the-glow-evil-twin', 'hookmaster']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'gamgee'],
                    hand: ['murkens', 'murkens', 'murkens', 'murkens', 'murkens', 'murkens']
                }
            });
        });

        describe('when the tide is neutral', function () {
            it('should do nothing', function () {
                this.player1.reap(this.tomwaOfTheGlowEvilTwin);
                this.expectReadyToTakeAction(this.player1);
            });
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should do nothing', function () {
                this.player1.reap(this.tomwaOfTheGlowEvilTwin);
                this.expectReadyToTakeAction(this.player1);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            describe('and there are no enemy creatures in play', function () {
                beforeEach(function () {
                    this.player2.moveCard(this.gamgee, 'discard');
                    this.player2.moveCard(this.lamindra, 'discard');
                    this.player1.reap(this.tomwaOfTheGlowEvilTwin);
                });

                it("should discard a random card from opponent's hand", function () {
                    expect(this.player2.player.hand.length).toBe(5);
                    this.expectReadyToTakeAction(this.player1);
                });
            });

            describe('and there are enemy creatures in play', function () {
                beforeEach(function () {
                    this.player1.reap(this.tomwaOfTheGlowEvilTwin);
                });

                it("should exhaust an enemy creature and discard a card from opponent's hand", function () {
                    expect(this.player1).toBeAbleToSelect(this.lamindra);
                    expect(this.player1).toBeAbleToSelect(this.gamgee);
                    expect(this.player1).not.toBeAbleToSelect(this.tomwaOfTheGlowEvilTwin);
                    expect(this.player1).not.toBeAbleToSelect(this.hookmaster);
                    this.player1.clickCard(this.gamgee);
                    expect(this.gamgee.exhausted).toBe(true);
                    expect(this.player2.player.hand.length).toBe(5);
                    this.expectReadyToTakeAction(this.player1);
                });
            });
        });
    });
});
