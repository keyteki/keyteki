describe('Anger', function () {
    describe("Anger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ancient-bear', 'troll', 'giant-sloth'],
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
            this.expectReadyToTakeAction(this.player1);
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

        it('should remove the stun from a stunned target when it cannot fight', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.foggify);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.troll.stun();
            this.player1.play(this.anger);
            expect(this.player1).toHavePrompt('Anger');
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.troll.stunned).toBe(false);
        });

        it('should not remove the stun from a target that cannot be used', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.foggify);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.giantSloth.exhausted = true;
            this.giantSloth.stun();
            this.player1.play(this.anger);
            expect(this.player1).toHavePrompt('Anger');
            this.player1.clickCard(this.giantSloth);
            expect(this.giantSloth.exhausted).toBe(false);
            expect(this.giantSloth.stunned).toBe(true);
        });
    });

    describe("Anger's ability when no opponent's creatures in play", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ancient-bear', 'troll'],
                    hand: ['anger']
                },
                player2: {
                    hand: ['foggify']
                }
            });
        });

        it('should ready a target', function () {
            this.player1.reap(this.troll);
            this.player1.play(this.anger);
            expect(this.player1).toHavePrompt('Anger');
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(false);
            this.player1.reap(this.troll);
            this.player1.endTurn();
        });

        it('should remove the stun from a stunned target', function () {
            this.ancientBear.stun();
            this.player1.play(this.anger);
            expect(this.player1).toHavePrompt('Anger');
            this.player1.clickCard(this.ancientBear);
            expect(this.ancientBear.exhausted).toBe(true);
            expect(this.ancientBear.stunned).toBe(false);
        });
    });
});
