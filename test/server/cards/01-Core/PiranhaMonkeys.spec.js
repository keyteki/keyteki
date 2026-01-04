describe('Piranha Monkeys', function () {
    describe("Piranha Monkeys' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['ancient-bear', 'piranha-monkeys']
                },
                player2: {
                    inPlay: ['troll', 'batdrone']
                }
            });
        });

        it('should deal 2 damage to each other creature on play', function () {
            this.player1.moveCard(this.piranhaMonkeys, 'hand');
            this.player1.playCreature(this.piranhaMonkeys);
            expect(this.ancientBear.tokens.damage).toBe(2);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.batdrone.location).toBe('discard');
            expect(this.piranhaMonkeys.tokens.damage).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should deal 2 damage to each other creature on reap', function () {
            this.player1.reap(this.piranhaMonkeys);
            expect(this.ancientBear.tokens.damage).toBe(2);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.batdrone.location).toBe('discard');
            expect(this.piranhaMonkeys.tokens.damage).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
