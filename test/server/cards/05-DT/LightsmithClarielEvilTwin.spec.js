describe('Lightsmith Clariel Evil Twin', function () {
    describe("Lightsmith Clariel Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 1,
                    hand: [],
                    inPlay: ['flaxia', 'lightsmith-clariel-evil-twin', 'seeker-of-truth']
                },
                player2: {
                    amber: 1,
                    inPlay: ['krump', 'gub']
                }
            });
        });

        it('should be able target all creatures with the effect', function () {
            this.player1.useAction(this.lightsmithClarielEvilTwin);

            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.lightsmithClarielEvilTwin);
            expect(this.player1).toBeAbleToSelect(this.seekerOfTruth);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickPrompt('Done');

            this.player1.endTurn();
        });

        it('should be able swap power of a creature and kill it', function () {
            expect(this.krump.location).toBe('play area');
            this.player1.useAction(this.lightsmithClarielEvilTwin);
            this.player1.clickCard(this.krump);
            this.player1.endTurn();
            expect(this.krump.location).toBe('discard');
        });

        it('should be able swap power creature and have it live for long time with those new stats', function () {
            expect(this.seekerOfTruth.power).toBe(3);
            expect(this.seekerOfTruth.armor).toBe(1);

            expect(this.seekerOfTruth.location).toBe('play area');
            this.player1.useAction(this.lightsmithClarielEvilTwin);
            this.player1.clickCard(this.seekerOfTruth);
            expect(this.seekerOfTruth.location).toBe('play area');

            expect(this.seekerOfTruth.power).toBe(1);
            expect(this.seekerOfTruth.armor).toBe(3);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');

            expect(this.seekerOfTruth.power).toBe(1);
            expect(this.seekerOfTruth.armor).toBe(3);
        });

        it('should not impact power tokens', function () {
            expect(this.seekerOfTruth.power).toBe(3);
            expect(this.seekerOfTruth.armor).toBe(1);

            this.seekerOfTruth.addToken('power');
            expect(this.seekerOfTruth.power).toBe(4);

            expect(this.seekerOfTruth.location).toBe('play area');
            this.player1.useAction(this.lightsmithClarielEvilTwin);
            this.player1.clickCard(this.seekerOfTruth);
            expect(this.seekerOfTruth.location).toBe('play area');

            expect(this.seekerOfTruth.power).toBe(2);
            expect(this.seekerOfTruth.armor).toBe(3);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');

            expect(this.seekerOfTruth.power).toBe(2);
            expect(this.seekerOfTruth.armor).toBe(3);

            this.seekerOfTruth.addToken('power');

            expect(this.seekerOfTruth.power).toBe(3);
            expect(this.seekerOfTruth.armor).toBe(3);
        });
    });
});
