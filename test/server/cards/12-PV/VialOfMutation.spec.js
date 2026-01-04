describe('Vial of Mutation', function () {
    describe("Vial of Mutation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'redemption',
                    hand: ['vial-of-mutation'],
                    inPlay: ['ember-imp', 'troll', 'krump']
                },
                player2: {
                    // Warning: Fandangle is already a mutant.
                    inPlay: ['ancient-bear', 'fandangle', 'antiquities-dealer', 'envoy-of-ekwirrĕ'],
                    hand: ['flying-broomstick']
                }
            });
        });

        it('should put a mutation counter on 2 creatures and make them gain the Mutant trait', function () {
            this.player1.play(this.vialOfMutation);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.fandangle);

            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.ancientBear);
            this.player1.clickPrompt('Done');

            expect(this.emberImp.tokens.mutation).toBe(1);
            expect(this.ancientBear.tokens.mutation).toBe(1);
            expect(this.emberImp.hasTrait('mutant')).toBe(true);
            expect(this.ancientBear.hasTrait('mutant')).toBe(true);
            expect(this.krump.hasTrait('mutant')).toBe(false);
            expect(this.troll.hasTrait('mutant')).toBe(false);
            expect(this.fandangle.hasTrait('mutant')).toBe(true);

            expect(this.player1).isReadyToTakeAction();
        });

        it('should remove the Mutant trait when the card is discarded', function () {
            this.player1.play(this.vialOfMutation);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');

            expect(this.emberImp.hasTrait('mutant')).toBe(true);
            expect(this.troll.hasTrait('mutant')).toBe(true);

            this.player1.moveCard(this.emberImp, 'discard');
            expect(this.emberImp.hasTrait('mutant')).toBe(false);
            expect(this.troll.hasTrait('mutant')).toBe(true);
        });

        it('should remove the Mutant trait when the counter is removed', function () {
            this.player1.play(this.vialOfMutation);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.antiquitiesDealer);
            this.player1.clickPrompt('Done');

            this.player1.endTurn();

            expect(this.antiquitiesDealer.hasTrait('mutant')).toBe(true);

            this.player2.clickPrompt('untamed');
            this.player2.playUpgrade(this.flyingBroomstick, this.ancientBear);

            // Reaping with Flying Broomstick equipped lets us clear all tokens
            // from a target.
            this.player2.reap(this.ancientBear);
            this.player2.clickCard(this.antiquitiesDealer);

            // Lose the token, lose the trait.
            expect(this.antiquitiesDealer.hasToken('mutation')).toBe(false);
            expect(this.antiquitiesDealer.hasTrait('mutant')).toBe(false);
        });

        it('should remove and restore the Mutant trait when the Mutation token moves to a different card', function () {
            this.player1.play(this.vialOfMutation);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.antiquitiesDealer);
            this.player1.clickPrompt('Done');

            this.player1.endTurn();

            this.player2.clickPrompt('ekwidon');

            expect(this.antiquitiesDealer.hasTrait('mutant')).toBe(true);

            this.player2.reap(this.envoyOfEkwirrĕ);
            this.player2.clickCard(this.antiquitiesDealer);

            // The Mutation counter should be moved to the Envoy
            expect(this.antiquitiesDealer.hasToken('mutation')).toBe(false);
            expect(this.envoyOfEkwirrĕ.hasToken('mutation')).toBe(true);

            // But _neither_ of them should be considered a mutant. The Envoy
            // was not an original target of the Vial, so it has no effect that
            // interprets a Mutation token.
            expect(this.antiquitiesDealer.hasTrait('mutant')).toBe(false);
            expect(this.envoyOfEkwirrĕ.hasTrait('mutant')).toBe(false);

            // Messing with Antiquities Dealer has no effect on Ember Imp’s
            // mutation token and effect.
            expect(this.emberImp.hasTrait('mutant')).toBe(true);

            // Ready so we can reap and swap back.
            this.envoyOfEkwirrĕ.ready();

            this.player2.reap(this.envoyOfEkwirrĕ);
            this.player2.clickCard(this.antiquitiesDealer);

            // The Mutation counter should be back on the Antiquities Dealer
            expect(this.antiquitiesDealer.hasToken('mutation')).toBe(true);
            expect(this.envoyOfEkwirrĕ.hasToken('mutation')).toBe(false);

            // And Antiquities Dealer should be a Mutant again, since it has a
            // counter and the Vial’s effect still applies.
            expect(this.antiquitiesDealer.hasTrait('mutant')).toBe(true);
            expect(this.envoyOfEkwirrĕ.hasTrait('mutant')).toBe(false);

            // Move tokens back to the Envoy
            this.envoyOfEkwirrĕ.ready();
            this.player2.reap(this.envoyOfEkwirrĕ);
            this.player2.clickCard(this.antiquitiesDealer);

            // Bounce Antiquities Dealer to hand so we can play it again and
            // ensure that it has lost its Mutation token -> mutant effect.
            this.player2.moveCard(this.antiquitiesDealer, 'hand');
            this.player2.playCreature(this.antiquitiesDealer, false);

            this.envoyOfEkwirrĕ.ready();
            this.player2.reap(this.envoyOfEkwirrĕ);
            this.player2.clickCard(this.antiquitiesDealer);

            // The Mutation counter should be back on the Antiquities Dealer
            expect(this.antiquitiesDealer.hasToken('mutation')).toBe(true);
            expect(this.envoyOfEkwirrĕ.hasToken('mutation')).toBe(false);

            // But it should not be a mutant because the effect does not persist
            // through leaving play.
            expect(this.antiquitiesDealer.hasTrait('mutant')).toBe(false);
            expect(this.envoyOfEkwirrĕ.hasTrait('mutant')).toBe(false);

            // Still got the token, still a mutant.
            expect(this.emberImp.hasTrait('mutant')).toBe(true);
        });
    });
});
