describe('Honored Battlemaster', function () {
    describe("Honored Battlemaster's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ancient-bear', 'honored-battlemaster', 'troll', 'umbra']
                },
                player2: {
                    inPlay: ['batdrone', 'doc-bookton']
                }
            });
        });

        it('should allow fighting with an exhausted neighbor', function () {
            this.player1.fightWith(this.troll, this.docBookton);
            expect(this.troll.exhausted).toBe(true);
            expect(this.docBookton.location).toBe('discard');

            this.player1.useAction(this.honoredBattlemaster);
            expect(this.player1).toHavePrompt('Honored Battlemaster');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).not.toBeAbleToSelect(this.honoredBattlemaster);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);

            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.batdrone);
            expect(this.troll.exhausted).toBe(true);
            expect(this.batdrone.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow fighting with a ready neighbor', function () {
            this.player1.useAction(this.honoredBattlemaster);
            expect(this.player1).toHavePrompt('Honored Battlemaster');
            this.player1.clickCard(this.ancientBear);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.ancientBear.exhausted).toBe(true);
            expect(this.ancientBear.tokens.damage).toBeUndefined(); // assault
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow targeting when no neighbors exist', function () {
            this.player1.moveCard(this.troll, 'discard');
            this.player1.moveCard(this.ancientBear, 'discard');
            this.player1.moveCard(this.umbra, 'discard');
            this.player1.useAction(this.honoredBattlemaster);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
