describe('Inspiration', function () {
    describe("Inspiration's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['ancient-bear', 'champion-anaphiel', 'giant-sloth'],
                    hand: ['inspiration']
                },
                player2: {
                    inPlay: ['dextre', 'hunting-witch'],
                    hand: ['foggify', 'opposition-research']
                }
            });

            this.player1.fightWith(this.championAnaphiel, this.dextre);
        });

        it('should allow fighting with an exhausted creature', function () {
            this.player1.play(this.inspiration);
            expect(this.player1).toHavePrompt('Inspiration');
            this.player1.clickCard(this.championAnaphiel);
            this.player1.clickPrompt('Fight with this creature');
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.huntingWitch);
            expect(this.championAnaphiel.exhausted).toBe(true);
            expect(this.championAnaphiel.location).toBe('play area');
            expect(this.championAnaphiel.tokens.damage).toBe(4);
            expect(this.huntingWitch.location).toBe('discard');
        });

        it('should allow reaping with an exhausted creature', function () {
            this.player1.play(this.inspiration);
            expect(this.player1).toHavePrompt('Inspiration');
            this.player1.clickCard(this.championAnaphiel);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.championAnaphiel.exhausted).toBe(true);
            expect(this.player1.amber).toBe(1);
        });

        it('should allow using a non-active house creature', function () {
            this.player1.play(this.inspiration);
            expect(this.player1).toHavePrompt('Inspiration');
            this.player1.clickCard(this.ancientBear);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.ancientBear.exhausted).toBe(true);
            expect(this.player1.amber).toBe(1);
        });

        it('should ready a target when it cannot reap or fight', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.foggify);
            this.player2.play(this.oppositionResearch);
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            this.championAnaphiel.exhausted = true;
            this.player1.play(this.inspiration);
            expect(this.player1).toHavePrompt('Inspiration');
            this.player1.clickCard(this.championAnaphiel);
            this.expectReadyToTakeAction(this.player1);
            expect(this.championAnaphiel.exhausted).toBe(false);
        });

        it('should remove the stun from a stunned target', function () {
            this.championAnaphiel.stun();
            this.player1.play(this.inspiration);
            expect(this.player1).toHavePrompt('Inspiration');
            this.player1.clickCard(this.championAnaphiel);
            expect(this.championAnaphiel.exhausted).toBe(true);
            expect(this.championAnaphiel.stunned).toBe(false);
        });

        it('should remove the stun from a stunned target when it cannot reap or fight', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.foggify);
            this.player2.play(this.oppositionResearch);
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            this.championAnaphiel.stun();
            this.player1.play(this.inspiration);
            expect(this.player1).toHavePrompt('Inspiration');
            this.player1.clickCard(this.championAnaphiel);
            expect(this.championAnaphiel.exhausted).toBe(true);
            expect(this.championAnaphiel.stunned).toBe(false);
        });

        it('should not remove the stun from a target that cannot be used', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.foggify);
            this.player2.play(this.oppositionResearch);
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            this.giantSloth.exhausted = true;
            this.giantSloth.stun();
            this.player1.play(this.inspiration);
            expect(this.player1).toHavePrompt('Inspiration');
            this.player1.clickCard(this.giantSloth);
            expect(this.giantSloth.exhausted).toBe(false);
            expect(this.giantSloth.stunned).toBe(true);
        });
    });
});
