describe('Lady Loreena', function () {
    describe("Lady Loreena's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['gub'],
                    amber: 3
                },
                player2: {
                    amber: 2,
                    inPlay: [
                        'grey-monk',
                        'lamindra',
                        'champion-anaphiel',
                        'bulwark',
                        'lady-loreena',
                        'francus',
                        'redlock',
                        'gamgee'
                    ]
                }
            });
        });

        it("should protect her neighbor's neighbor with her taunt", function () {
            this.player1.clickCard(this.gub);
            this.player1.clickPrompt('Fight with this creature');
            expect(this.player1).toBeAbleToSelect(this.greyMonk);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.ladyLoreena);
            expect(this.player1).not.toBeAbleToSelect(this.francus);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            expect(this.player1).toBeAbleToSelect(this.gamgee);
        });
    });
});
