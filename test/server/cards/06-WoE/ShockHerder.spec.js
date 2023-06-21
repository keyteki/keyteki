describe('Shock Herder', function () {
    describe("Shock Herder's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['shock-herder'],
                    inPlay: ['bumpsy', 'ancient-bear']
                },
                player2: {
                    inPlay: ['batdrone', 'dextre']
                }
            });
        });

        it('on play, it should allow fighting with an exhausted creature', function () {
            this.player1.reap(this.bumpsy);
            expect(this.bumpsy.exhausted).toBe(true);
            this.player1.playCreature(this.shockHerder, true, true);
            this.player1.clickCard(this.ancientBear); // click to position
            this.player1.clickCard(this.bumpsy); // click to fight
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.batdrone);
            expect(this.bumpsy.location).toBe('play area');
            expect(this.bumpsy.tokens.damage).toBe(2);
            expect(this.batdrone.location).toBe('discard');
        });

        it('on play, it should allow fighting with an off-house creature', function () {
            this.player1.reap(this.bumpsy);
            expect(this.bumpsy.exhausted).toBe(true);
            this.player1.playCreature(this.shockHerder, true, true);
            this.player1.clickCard(this.ancientBear); // click to position
            this.player1.clickCard(this.ancientBear); // click to fight
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.batdrone);
            expect(this.ancientBear.location).toBe('play area');
            expect(this.ancientBear.tokens.damage).toBe(undefined);
            expect(this.batdrone.location).toBe('discard');
        });
    });
});
