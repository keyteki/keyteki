describe('Lapisaurus', function () {
    describe("Lapisaurus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    hand: [],
                    inPlay: ['lapisaurus', 'consul-primus', 'rhetor-gallim']
                },
                player2: {
                    amber: 1,
                    inPlay: ['mother', 'earthshaker', 'dust-pixie', 'daughter']
                }
            });
        });

        it('should not exalt lapisaurus when attacking', function () {
            this.player1.amber = 1;
            this.player2.amber = 1;

            expect(this.lapisaurus.tokens.amber).toBeUndefined();
            this.player1.fightWith(this.lapisaurus, this.dustPixie);
            this.player1.endTurn();
            expect(this.lapisaurus.tokens.amber).toBeUndefined();

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('should not exalt friendly creature when attacking', function () {
            this.player1.amber = 1;
            this.player2.amber = 1;

            expect(this.rhetorGallim.tokens.amber).toBeUndefined();
            expect(this.lapisaurus.tokens.amber).toBeUndefined();
            this.player1.fightWith(this.rhetorGallim, this.dustPixie);
            this.player1.endTurn();

            expect(this.rhetorGallim.tokens.amber).toBeUndefined();
            expect(this.lapisaurus.tokens.amber).toBeUndefined();
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('should not exalt enemy creature when attacking other creatures', function () {
            this.player1.amber = 1;
            this.player2.amber = 1;

            expect(this.mother.location).toBe('play area');
            expect(this.rhetorGallim.location).toBe('play area');

            this.player1.endTurn();
            this.player2.clickPrompt('logos');

            expect(this.mother.tokens.amber).toBeUndefined();
            expect(this.lapisaurus.tokens.amber).toBeUndefined();

            this.player2.fightWith(this.mother, this.rhetorGallim);
            this.player2.endTurn();

            expect(this.lapisaurus.tokens.amber).toBeUndefined();
            expect(this.mother.tokens.amber).toBeUndefined();
            expect(this.rhetorGallim.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('should exalt enemy creatures attacking it', function () {
            this.player1.amber = 1;
            this.player2.amber = 1;

            this.player1.endTurn();
            this.player2.clickPrompt('logos');

            expect(this.mother.tokens.amber).toBeUndefined();
            expect(this.lapisaurus.tokens.amber).toBeUndefined();

            this.player2.fightWith(this.mother, this.lapisaurus);
            this.player2.endTurn();

            expect(this.lapisaurus.location).toBe('play area');
            expect(this.mother.location).toBe('play area');
            expect(this.mother.tokens.damage).toBe(4);

            expect(this.lapisaurus.tokens.amber).toBeUndefined();
            expect(this.mother.tokens.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('should exalt enemy creatures attacking it and gain amber if they die', function () {
            this.player1.amber = 1;
            this.player2.amber = 1;

            this.player1.endTurn();
            this.player2.clickPrompt('logos');

            expect(this.daughter.tokens.amber).toBeUndefined();
            expect(this.lapisaurus.tokens.amber).toBeUndefined();

            this.player2.fightWith(this.daughter, this.lapisaurus);
            this.player2.endTurn();

            expect(this.lapisaurus.location).toBe('play area');
            expect(this.daughter.location).toBe('discard');

            expect(this.lapisaurus.tokens.amber).toBeUndefined();
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
        });
    });
});
