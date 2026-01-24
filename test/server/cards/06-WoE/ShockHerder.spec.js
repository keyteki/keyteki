describe('Shock Herder', function () {
    describe("Shock Herder's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['shock-herder'],
                    inPlay: ['bumpsy', 'ancient-bear', 'awakened-titan']
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
            expect(this.bumpsy.damage).toBe(2);
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
            expect(this.ancientBear.damage).toBe(0);
            expect(this.batdrone.location).toBe('discard');
        });

        it('on play, it should allow selecting a creature that cannot ready', function () {
            this.player1.reap(this.awakenedTitan);
            expect(this.awakenedTitan.exhausted).toBe(true);
            this.player1.playCreature(this.shockHerder, true, true);
            this.player1.clickCard(this.awakenedTitan); // click to position
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.awakenedTitan);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.awakenedTitan); // click to fail ready
            expect(this.awakenedTitan.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
