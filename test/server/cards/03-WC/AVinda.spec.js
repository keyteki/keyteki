describe('A. Vinda', function () {
    describe("A. Vinda's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['a-vinda', 'mooncurser', 'tantadlin'],
                    hand: ['knoxx', 'knoxx', 'knoxx', 'knoxx', 'knoxx', 'knoxx']
                },
                player2: {
                    inPlay: ['lamindra', 'krump'],
                    hand: ['troll', 'groggins', 'groggins', 'groggins', 'groggins', 'groggins']
                }
            });
        });

        it("Destroy a 1 power friendly creature and discard card from opponent's hand", function () {
            this.player1.reap(this.aVinda);

            expect(this.player1).toBeAbleToSelect(this.aVinda);
            expect(this.player1).toBeAbleToSelect(this.mooncurser);
            expect(this.player1).toBeAbleToSelect(this.tantadlin);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.mooncurser);

            expect(this.mooncurser.location).toBe('discard');
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(5);
        });

        it("Destroy an enemy creature and discard card from opponent's hand", function () {
            this.krump.tokens['damage'] = 5;

            this.player1.reap(this.aVinda);

            expect(this.player1).toBeAbleToSelect(this.aVinda);
            expect(this.player1).toBeAbleToSelect(this.mooncurser);
            expect(this.player1).toBeAbleToSelect(this.tantadlin);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.krump);

            expect(this.krump.location).toBe('discard');
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(5);
        });

        it("Creature is damage, but not destroyed, so opponent's card should not be discarded", function () {
            this.player1.reap(this.aVinda);

            expect(this.player1).toBeAbleToSelect(this.aVinda);
            expect(this.player1).toBeAbleToSelect(this.mooncurser);
            expect(this.player1).toBeAbleToSelect(this.tantadlin);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.aVinda);

            expect(this.aVinda.tokens.damage).toBe(1);

            expect(this.aVinda.location).toBe('play area');
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(6);
        });
    });
});
