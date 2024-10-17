describe('Mindwarper', function () {
    describe("Mindwarper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    inPlay: ['mindwarper', 'zorg']
                },
                player2: {
                    amber: 2,
                    inPlay: ['bumpsy']
                }
            });
        });

        it("should prompt for a target and place one of its controller's amber on that creature", function () {
            this.player1.useAction(this.mindwarper);
            expect(this.player1).toHavePrompt('Mindwarper');
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.mindwarper);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.bumpsy.tokens.amber).toBe(1);
        });

        it("should give the amber to the creature's opponent when killed", function () {
            this.player1.useAction(this.mindwarper);
            this.player1.clickCard(this.bumpsy);
            this.player1.fightWith(this.zorg, this.bumpsy);
            expect(this.bumpsy.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
        });
    });
});
