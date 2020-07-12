describe('Bring Low', function () {
    describe("Bring low's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['bring-low', 'lord-golgotha', 'sequis']
                },
                player2: {
                    inPlay: ['troll', 'snufflegator'],
                    amber: 1
                }
            });
        });

        it('should have no effect when opponents amber is less than 5', function () {
            this.player1.play(this.lordGolgotha);
            this.player1.play(this.bringLow);
            expect(this.player1).not.toHavePrompt('Choose a creature to capture 1 amber');
        });

        it('should have no effect when opponents amber is exactly 5', function () {
            this.player2.amber = 5;
            this.player1.play(this.lordGolgotha);
            this.player1.play(this.bringLow);
            expect(this.player1).not.toHavePrompt('Choose a creature to capture 1 amber');
        });

        it('should have no effect when there are no friendly creatures', function () {
            this.player2.amber = 20;
            this.player1.play(this.bringLow);
            expect(this.player1).not.toHavePrompt('Choose a creature to capture 1 amber');
        });

        it('should allow capturing onto different creatures', function () {
            this.player2.amber = 7;
            this.player1.play(this.lordGolgotha);
            this.player1.play(this.sequis);
            this.player1.play(this.bringLow);

            expect(this.player1).toHavePrompt('Choose a creature to capture 1 amber');
            expect(this.player1).not.toHavePromptButton('Done');
            expect(this.player1).toBeAbleToSelect(this.lordGolgotha);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
            this.player1.clickCard(this.lordGolgotha);
            this.player1.clickCard(this.sequis);
            expect(this.player1).not.toHavePrompt('Choose a creature to capture 1 amber');
            expect(this.lordGolgotha.tokens.amber).toBe(1);
            expect(this.sequis.tokens.amber).toBe(1);
            expect(this.player2.amber).toBe(5);
        });

        it('should allow capturing onto the same creature', function () {
            this.player2.amber = 7;
            this.player1.play(this.lordGolgotha);
            this.player1.play(this.sequis);
            this.player1.play(this.bringLow);

            this.player1.clickCard(this.lordGolgotha);
            this.player1.clickCard(this.lordGolgotha);
            expect(this.player1).not.toHavePrompt('Choose a creature to capture 1 amber');
            expect(this.lordGolgotha.tokens.amber).toBe(2);
            expect(this.sequis.tokens.amber).toBeUndefined();
            expect(this.player2.amber).toBe(5);
        });
    });
});
