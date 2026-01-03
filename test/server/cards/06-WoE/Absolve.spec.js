describe('Absolve', function () {
    describe("Absolve's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 5,
                    hand: ['absolve'],
                    inPlay: ['troll', 'flaxia', 'holdfast']
                },
                player2: {
                    amber: 5,
                    inPlay: ['krump']
                }
            });
        });

        it('should heal 1 from each damage creature and capture 1 from their opponent', function () {
            this.troll.addToken('damage', 2);
            this.flaxia.addToken('damage', 1);
            this.krump.addToken('damage', 1);

            this.player1.play(this.absolve);

            expect(this.troll.tokens.damage).toBe(1);
            expect(this.flaxia.hasToken('damage')).toBe(false);
            expect(this.holdfast.hasToken('damage')).toBe(false);
            expect(this.krump.hasToken('damage')).toBe(false);

            expect(this.troll.tokens.amber).toBe(1);
            expect(this.flaxia.tokens.amber).toBe(1);
            expect(this.holdfast.hasToken('amber')).toBe(false);
            expect(this.krump.tokens.amber).toBe(1);

            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
        });

        it('should prompt for amber placement when necessary', function () {
            this.troll.addToken('damage', 2);
            this.flaxia.addToken('damage', 1);
            this.holdfast.addToken('damage', 1);
            this.krump.addToken('damage', 1);

            this.player1.amber = 0;
            this.player2.amber = 2;

            this.player1.play(this.absolve);

            expect(this.player1).toHavePrompt('Absolve');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.holdfast);
            expect(this.player1).not.toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');

            expect(this.troll.tokens.damage).toBe(1);
            expect(this.flaxia.hasToken('damage')).toBe(false);
            expect(this.holdfast.hasToken('damage')).toBe(false);
            expect(this.krump.hasToken('damage')).toBe(false);

            expect(this.troll.tokens.amber).toBe(1);
            expect(this.flaxia.tokens.amber).toBe(1);
            expect(this.holdfast.hasToken('amber')).toBe(false);
            expect(this.krump.tokens.amber).toBe(1);

            this.expectReadyToTakeAction(this.player1);
        });
    });
});
