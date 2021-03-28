describe('Extinction', function () {
    describe("Extinction's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['flaxia', 'eldest-bear', 'dharna', 'floomf', 'mushroom-man'],
                    hand: ['extinction'],
                    amber: 4
                },
                player2: {
                    amber: 2,
                    inPlay: ['gargantodon', 'senator-shrix']
                }
            });
        });

        it('should kill creatures with the same trait and gain 1 chain', function () {
            this.player1.play(this.extinction);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.eldestBear);
            expect(this.player1).toBeAbleToSelect(this.dharna);
            expect(this.player1).toBeAbleToSelect(this.floomf);
            expect(this.player1).toBeAbleToSelect(this.mushroomMan);
            expect(this.player1).toBeAbleToSelect(this.gargantodon);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            this.player1.clickCard(this.eldestBear);
            expect(this.flaxia.location).toBe('play area');
            expect(this.eldestBear.location).toBe('discard');
            expect(this.dharna.location).toBe('discard');
            expect(this.floomf.location).toBe('discard');
            expect(this.mushroomMan.location).toBe('play area');
            expect(this.gargantodon.location).toBe('discard');
            expect(this.senatorShrix.location).toBe('play area');
        });

        it('should not kill selected warded creature', function () {
            this.eldestBear.tokens.ward = 1;

            this.player1.play(this.extinction);
            this.player1.clickCard(this.eldestBear);
            expect(this.flaxia.location).toBe('play area');
            expect(this.eldestBear.location).toBe('play area');
            expect(this.dharna.location).toBe('discard');
            expect(this.floomf.location).toBe('discard');
            expect(this.mushroomMan.location).toBe('play area');
            expect(this.gargantodon.location).toBe('discard');
            expect(this.senatorShrix.location).toBe('play area');
        });
    });
});
