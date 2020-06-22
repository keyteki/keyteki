describe('City-State Interest', function () {
    describe("City-State Interest's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['troll', 'valdr', 'krump'],
                    hand: ['city-state-interest']
                },
                player2: {
                    amber: 6,
                    inPlay: ['lamindra']
                }
            });
        });

        it('Play will make each friendly creature capture 1 amber', function () {
            this.player1.play(this.cityStateInterest);

            expect(this.troll.tokens.amber).toBe(1);
            expect(this.valdr.tokens.amber).toBe(1);
            expect(this.krump.tokens.amber).toBe(1);
            expect(this.lamindra.hasToken('amber')).toBe(false);
        });
    });
    describe("City-State Interest's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['troll', 'valdr', 'krump'],
                    hand: ['city-state-interest']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra']
                }
            });
        });

        it('will let player choose which creatures capture if there are more creatures than opponent amber', function () {
            this.player1.play(this.cityStateInterest);
            expect(this.player1).toHavePrompt('City-State Interest');
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.valdr);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.valdr);
            this.player1.clickPrompt('Done');
            expect(this.player2.player.amber).toBe(0);
            expect(this.troll.tokens.amber).toBe(1);
            expect(this.valdr.tokens.amber).toBe(1);
            expect(this.krump.hasToken('amber')).toBe(false);
            expect(this.lamindra.hasToken('amber')).toBe(false);
        });
    });
});
