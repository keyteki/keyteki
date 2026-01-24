describe('Aquilia, Lone Hero', function () {
    describe("Aquilia, Lone Hero's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['paraguardian'],
                    inPlay: ['aquilia-lone-hero', 'troll']
                },
                player2: {
                    amber: 1,
                    inPlay: ['mother', 'brain-eater', 'dextre']
                }
            });
        });

        it('should capture with less creatures', function () {
            this.player1.useOmni(this.aquiliaLoneHero);
            expect(this.aquiliaLoneHero.tokens.amber).toBe(1);
        });

        it('should not capture with equal creatures', function () {
            this.player1.playCreature(this.paraguardian);
            this.player1.useOmni(this.aquiliaLoneHero);
            expect(this.aquiliaLoneHero.tokens.amber).toBe(undefined);
        });

        it('should be omni', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('Logos');
            this.player2.endTurn();
            this.player1.clickPrompt('Brobnar');
            this.player1.useOmni(this.aquiliaLoneHero);
            expect(this.aquiliaLoneHero.tokens.amber).toBe(1);
        });
    });
});
