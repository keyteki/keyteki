describe('J. Vinda', function () {
    describe("J. Vinda's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'shadows',
                    inPlay: ['j-vinda', 'mooncurser', 'tantadlin'],
                    hand: ['knoxx', 'knoxx', 'knoxx', 'knoxx', 'knoxx', 'knoxx']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'krump'],
                    hand: ['troll', 'groggins', 'groggins', 'groggins', 'groggins', 'groggins']
                }
            });
        });

        it('Destroy a 1 power friendly creature and steal 1 amber', function () {
            this.player1.reap(this.jVinda);

            expect(this.player1).toBeAbleToSelect(this.jVinda);
            expect(this.player1).toBeAbleToSelect(this.mooncurser);
            expect(this.player1).toBeAbleToSelect(this.tantadlin);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.mooncurser);

            expect(this.mooncurser.location).toBe('discard');
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(1);
        });

        it('Destroy an enemy creature and steal 1 amber', function () {
            this.krump.tokens['damage'] = 5;

            this.player1.reap(this.jVinda);

            expect(this.player1).toBeAbleToSelect(this.jVinda);
            expect(this.player1).toBeAbleToSelect(this.mooncurser);
            expect(this.player1).toBeAbleToSelect(this.tantadlin);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.krump);

            expect(this.krump.location).toBe('discard');
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(1);
        });

        it('Destroy an enemy creature, but opponent does not have amber', function () {
            this.player2.amber = 0;
            this.krump.tokens['damage'] = 5;

            this.player1.reap(this.jVinda);

            expect(this.player1).toBeAbleToSelect(this.jVinda);
            expect(this.player1).toBeAbleToSelect(this.mooncurser);
            expect(this.player1).toBeAbleToSelect(this.tantadlin);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.krump);

            expect(this.krump.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
        });

        it('Creature is damage, but not destroyed, so no stealing', function () {
            this.player1.reap(this.jVinda);

            expect(this.player1).toBeAbleToSelect(this.jVinda);
            expect(this.player1).toBeAbleToSelect(this.mooncurser);
            expect(this.player1).toBeAbleToSelect(this.tantadlin);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.jVinda);

            expect(this.jVinda.tokens.damage).toBe(1);

            expect(this.jVinda.location).toBe('play area');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
        });
    });
});
