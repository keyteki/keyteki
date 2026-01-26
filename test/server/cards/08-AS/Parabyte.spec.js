describe('Parabyte', function () {
    describe("Parabyte's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 9,
                    house: 'geistoid',
                    inPlay: ['mother', 'ælbia-stray', 'animator'],
                    hand: ['parabyte'],
                    discard: new Array(10).fill('poke') // haunted
                },
                player2: {
                    amber: 12,
                    hand: ['hypnobeam', 'yxili-marauder'],
                    inPlay: ['urchin', 'zorg']
                }
            });

            this.urchin.amber = 1;
            this.player1.play(this.parabyte);
        });

        it('should allow you to target friendly creatures', function () {
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.ælbiaStray);
            expect(this.player1).toBeAbleToSelect(this.parabyte);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
        });

        it('should capture on play', function () {
            this.player1.clickCard(this.mother);
            expect(this.mother.amber).toBe(1);
            expect(this.player2.amber).toBe(11);
        });

        it('should capture on reap', function () {
            this.player1.clickCard(this.mother);
            this.parabyte.ready();
            this.player1.reap(this.parabyte);
            this.player1.clickCard(this.mother);
            expect(this.mother.amber).toBe(2);
            expect(this.player2.amber).toBe(10);
        });

        it('should increase cost for each amber on friendly creature', function () {
            this.player1.clickCard(this.mother);
            this.player1.reap(this.ælbiaStray);
            this.parabyte.ready();
            this.player1.reap(this.parabyte);
            this.player1.clickCard(this.mother);
            this.player1.endTurn();

            // Forge for 9, with 3 captured amber.
            this.player2.forgeKey('Yellow');
            expect(this.player2.player.keys.yellow).toBe(true);
            expect(this.player2.player.amber).toBe(0);
        });

        it('should not count amber on artifacts towards key cost', function () {
            this.player1.clickCard(this.mother);
            this.animator.amber = 1;
            this.player1.endTurn();

            this.player2.forgeKey('Yellow');
            expect(this.player2.player.keys.yellow).toBe(true);
            expect(this.player2.player.amber).toBe(4);
        });
    });
});
