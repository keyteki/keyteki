describe('CuriaSaurus', function () {
    describe("CuriaSaurus's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['cyber-clone', 'mimic-gel'],
                    inPlay: ['curia-saurus', 'bad-penny']
                },
                player2: {
                    hand: [],
                    inPlay: ['troll', 'dextre'],
                    amber: 2
                }
            });
        });

        it('give every creature with amber on it a destroyed trigger', function () {
            this.badPenny.tokens.amber = 2;

            this.player1.fightWith(this.badPenny, this.troll);
            this.player1.clickCard(this.badPenny);
            this.player1.clickPrompt('Curia Saurus');

            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);

            this.player1.clickCard(this.troll);

            expect(this.troll.tokens.amber).toBe(1);
        });
    });
});
