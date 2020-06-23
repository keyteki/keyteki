describe('Anger', function () {
    describe("Anger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ancient-bear', 'troll'],
                    hand: ['anger']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'hunting-witch'],
                    hand: ['foggify']
                }
            });
            this.player1.fightWith(this.troll, this.mightyTiger);
        });

        it('should allow fighting with an exhausted creature', function () {
            this.player1.play(this.anger);
            expect(this.player1).toHavePrompt('Anger');
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            //expect(this.troll.exhausted).toBe(false);
            this.player1.clickCard(this.huntingWitch);
            expect(this.troll.exhausted).toBe(true);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.tokens.damage).toBe(6);
            expect(this.huntingWitch.location).toBe('discard');
        });

        it('should allow fighting with a non-active house creature', function () {
            this.player1.play(this.anger);
            expect(this.player1).toHavePrompt('Anger');
            this.player1.clickCard(this.ancientBear);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.huntingWitch);
            expect(this.ancientBear.exhausted).toBe(true);
            expect(this.ancientBear.location).toBe('play area');
            expect(this.ancientBear.hasToken('damage')).toBe(false);
            expect(this.huntingWitch.location).toBe('discard');
        });

        it('should ready a target when it cannot fight', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.foggify);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            expect(this.player1.amber).toBe(0);
            this.player1.reap(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
            this.player1.play(this.anger);
            expect(this.player1).toHavePrompt('Anger');
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.troll.exhausted).toBe(false);
        });

        it('should remove the stun from a stunned target', function () {
            this.troll.stun();
            this.player1.play(this.anger);
            expect(this.player1).toHavePrompt('Anger');
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.troll.stunned).toBe(false);
        });
    });
});
