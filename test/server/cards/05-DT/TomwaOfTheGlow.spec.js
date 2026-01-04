describe('Tomwa of the Glow', function () {
    describe("Tomwa of the Glow's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'unfathomable',
                    hand: ['gub', 'gub', 'gub', 'gub'],
                    inPlay: ['tomwa-of-the-glow', 'tomwa-of-the-glow-evil-twin', 'hookmaster']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'gamgee', 'murkens']
                }
            });
        });

        it('should exhaust a creature and not draw any card', function () {
            this.player1.reap(this.tomwaOfTheGlow);
            expect(this.player1).toBeAbleToSelect(this.tomwaOfTheGlow);
            expect(this.player1).toBeAbleToSelect(this.tomwaOfTheGlowEvilTwin);
            expect(this.player1).toBeAbleToSelect(this.hookmaster);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.gamgee);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.exhausted).toBe(true);
        });

        describe('when the tide is neutral', function () {
            it('should exhaust a creature and not draw any card', function () {
                this.player1.reap(this.tomwaOfTheGlow);
                this.player1.clickCard(this.lamindra);
                expect(this.lamindra.exhausted).toBe(true);
                expect(this.player1.player.hand.length).toBe(4);
            });
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should exhaust a creature and not draw any card', function () {
                this.player1.reap(this.tomwaOfTheGlow);
                this.player1.clickCard(this.lamindra);
                expect(this.lamindra.exhausted).toBe(true);
                expect(this.player1.player.hand.length).toBe(4);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
                this.murkens.exhausted = true;
            });

            it('should exhaust a friendly creature and draw a card for each exhausted enemy creature', function () {
                this.player1.reap(this.tomwaOfTheGlow);
                this.player1.clickCard(this.tomwaOfTheGlowEvilTwin);
                expect(this.tomwaOfTheGlowEvilTwin.exhausted).toBe(true);
                expect(this.player1.player.hand.length).toBe(5);
                expect(this.player1).isReadyToTakeAction();
            });

            it('should exhaust an enemy creature and draw a card for each exhausted enemy creature', function () {
                this.player1.reap(this.tomwaOfTheGlow);
                this.player1.clickCard(this.lamindra);
                expect(this.lamindra.exhausted).toBe(true);
                expect(this.player1.player.hand.length).toBe(6);
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
