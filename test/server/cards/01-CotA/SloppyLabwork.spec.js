describe('Sloppy Labwork', function () {
    describe("Sloppy Labwork's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['sloppy-labwork', 'dextre', 'batdrone']
                }
            });
        });

        it('should archive a card and discard a card', function () {
            this.player1.play(this.sloppyLabwork);
            this.player1.clickCard(this.dextre);
            this.player1.clickCard(this.batdrone);
            expect(this.sloppyLabwork.location).toBe('discard');
            expect(this.dextre.location).toBe('archives');
            expect(this.batdrone.location).toBe('discard');
        });

        it('should archive a card when only one is in hand', function () {
            this.player1.play(this.dextre);
            this.player1.play(this.sloppyLabwork);
            this.player1.clickCard(this.batdrone);
            expect(this.sloppyLabwork.location).toBe('discard');
            expect(this.dextre.location).toBe('play area');
            expect(this.batdrone.location).toBe('archives');
        });
    });
});
