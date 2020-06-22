describe("Helmsman Spears'", function () {
    describe("Helmsman Spears' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['helmsman-spears'],
                    hand: ['soulkeeper', 'tautau-vapors']
                },
                player2: {
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });
        it('should allow discarding any number of cards and drawing of the equal amount when reaping', function () {
            this.player1.reap(this.helmsmanSpears);
            expect(this.player1).toHavePrompt('Helmsman Spears');
            expect(this.player1).toBeAbleToSelect(this.soulkeeper);
            expect(this.player1).toBeAbleToSelect(this.tautauVapors);
            this.player1.clickCard(this.soulkeeper);
            this.player1.clickPrompt('Done');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.tautauVapors.location).toBe('hand');
            expect(this.player1.hand.length).toBe(2);
        });
        it('should allow discarding any number of cards and drawing of the equal amount when reaping', function () {
            this.player1.fightWith(this.helmsmanSpears, this.nexus);
            expect(this.player1).toHavePrompt('Helmsman Spears');
            expect(this.player1).toBeAbleToSelect(this.soulkeeper);
            expect(this.player1).toBeAbleToSelect(this.tautauVapors);
            this.player1.clickCard(this.soulkeeper);
            this.player1.clickPrompt('Done');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.tautauVapors.location).toBe('hand');
            expect(this.player1.hand.length).toBe(2);
        });
    });
});
