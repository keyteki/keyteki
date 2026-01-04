describe('Cursed Loot', function () {
    describe("Cursed Loot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['cursed-loot']
                },
                player2: {
                    hand: ['krump', 'ancient-bear', 'ember-imp'],
                    discard: ['reclaimed-by-nature']
                }
            });
        });

        it('should discard a random card after playing a card', function () {
            this.player1.play(this.cursedLoot);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.emberImp);

            expect(this.player2.player.hand.length).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should destroy itself if controller has no cards in hand', function () {
            this.player1.play(this.cursedLoot);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.moveCard(this.krump, 'discard');
            this.player2.play(this.emberImp);
            expect(this.player2.player.hand.length).toBe(0);
            expect(this.cursedLoot.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should destroy itself if controller has no cards in hand, even without a discard', function () {
            this.player1.play(this.cursedLoot);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.moveCard(this.krump, 'discard');
            this.player2.moveCard(this.ancientBear, 'discard');
            this.player2.play(this.emberImp);
            expect(this.player2.player.hand.length).toBe(0);
            expect(this.cursedLoot.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should let the player avoid a discard if purging the artifact', function () {
            this.player1.play(this.cursedLoot);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.moveCard(this.reclaimedByNature, 'hand');
            this.player2.play(this.reclaimedByNature);
            this.player2.clickPrompt(this.reclaimedByNature.name);
            this.player2.clickCard(this.cursedLoot);
            expect(this.player2.player.hand.length).toBe(3);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
