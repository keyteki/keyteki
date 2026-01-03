describe('Brawling Grounds', function () {
    describe("Brawling Grounds's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'grumpus',
                    hand: ['berserker-slam'],
                    inPlay: ['brawling-grounds', 'troll', 'grumpus:anger']
                },
                player2: {
                    hand: ['full-moon'],
                    inPlay: ['flaxia', 'dust-pixie']
                }
            });
        });

        it('does nothing if unactivated', function () {
            this.player1.fightWith(this.troll, this.flaxia);
            expect(this.player2.player.hand.length).toBe(1);
            expect(this.fullMoon.location).toBe('hand');
            this.expectReadyToTakeAction(this.player1);
        });

        it('causes opponent to discard at random when creature is destroyed', function () {
            this.player1.useAction(this.brawlingGrounds, true);
            this.player1.fightWith(this.troll, this.flaxia);
            expect(this.player2.player.hand.length).toBe(0);
            expect(this.fullMoon.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('causes self to discard at random when creature is destroyed', function () {
            this.player1.useAction(this.brawlingGrounds, true);
            this.player1.fightWith(this.grumpus, this.flaxia);
            this.player1.clickPrompt('Autoresolve');
            expect(this.grumpus.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard'); // Splash kills the urchin
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.berserkerSlam.location).toBe('discard');
            expect(this.player2.player.hand.length).toBe(0);
            expect(this.fullMoon.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
