describe('Pulse Cannon', function () {
    describe("Pulse Cannon's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['pulse-cannon', 'blypyp', 'troll', 'krump'],
                    hand: ['flaxia']
                },
                player2: {
                    inPlay: ['dust-pixie', 'silvertooth']
                }
            });
        });

        it('should stun a creature and each of its neighbors', function () {
            this.player1.useAction(this.pulseCannon);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);

            this.player1.clickCard(this.troll);
            expect(this.troll.stunned).toBe(true);
            expect(this.krump.stunned).toBe(true);
            expect(this.blypyp.stunned).toBe(true);
            expect(this.dustPixie.stunned).toBe(false);
            expect(this.silvertooth.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should stun a creature with only one neighbor', function () {
            this.player1.useAction(this.pulseCannon);
            this.player1.clickCard(this.dustPixie);
            expect(this.krump.stunned).toBe(false);
            expect(this.troll.stunned).toBe(false);
            expect(this.blypyp.stunned).toBe(false);
            expect(this.dustPixie.stunned).toBe(true);
            expect(this.silvertooth.stunned).toBe(true);
        });

        it('should stun a creature with no neighbors', function () {
            this.player1.player.moveCard(this.krump, 'discard');
            this.player1.player.moveCard(this.troll, 'discard');

            this.player1.useAction(this.pulseCannon);
            this.player1.clickCard(this.blypyp);
            expect(this.blypyp.stunned).toBe(true);
            expect(this.dustPixie.stunned).toBe(false);
            expect(this.silvertooth.stunned).toBe(false);
        });
    });
});
