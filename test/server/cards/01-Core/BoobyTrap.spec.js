describe('Booby Trap', function () {
    describe("Booby Trap's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['booby-trap']
                },
                player2: {
                    inPlay: ['bumpsy', 'krump', 'troll']
                }
            });
        });

        it('should deal 4 damage to a non-flank creature and 2 splash damage to neighbors', function () {
            expect(this.krump.isOnFlank()).toBe(false);
            this.player1.play(this.boobyTrap);
            expect(this.player1).toHavePrompt('Booby Trap');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(4);
            expect(this.bumpsy.tokens.damage).toBe(2);
            expect(this.troll.tokens.damage).toBe(2);
        });

        it('should work when target has only one neighbor', function () {
            this.player2.moveCard(this.troll, 'discard');
            expect(this.bumpsy.isOnFlank()).toBe(true);
            expect(this.krump.isOnFlank()).toBe(true);
            this.player1.play(this.boobyTrap);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(undefined);
            expect(this.bumpsy.tokens.damage).toBe(undefined);
        });
    });
});
