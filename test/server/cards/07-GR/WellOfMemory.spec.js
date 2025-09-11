describe('Well of Memory', function () {
    describe("Well of Memory's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['well-of-memory', 'flaxia', 'hunting-witch', 'a-strong-feeling'],
                    discard: ['ritual-of-balance', 'charette', 'full-moon']
                },
                player2: {
                    discard: ['crushing-deep', 'dust-pixie']
                }
            });
        });

        it('can purge 1 card from hand to return 1 from discard', function () {
            this.player1.play(this.wellOfMemory);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.aStrongFeeling);
            expect(this.player1).not.toBeAbleToSelect(this.ritualOfBalance);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.fullMoon);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Done');
            expect(this.flaxia.location).toBe('purged');

            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.aStrongFeeling);
            expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.fullMoon);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.crushingDeep);
            expect(this.player1).not.toHavePrompt('Done');
            this.player1.clickCard(this.charette);
            expect(this.charette.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can purge all card from hand to return 1 from discard for each', function () {
            this.player1.play(this.wellOfMemory);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.huntingWitch);
            this.player1.clickCard(this.aStrongFeeling);
            this.player1.clickPrompt('Done');
            expect(this.flaxia.location).toBe('purged');
            expect(this.huntingWitch.location).toBe('purged');
            expect(this.aStrongFeeling.location).toBe('purged');

            this.player1.clickCard(this.charette);
            this.player1.clickCard(this.ritualOfBalance);
            this.player1.clickCard(this.fullMoon);
            this.player1.clickPrompt('Done');
            expect(this.charette.location).toBe('hand');
            expect(this.ritualOfBalance.location).toBe('hand');
            expect(this.fullMoon.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can purge 0 cards from hand', function () {
            this.player1.play(this.wellOfMemory);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can destroy itself as an action', function () {
            this.player1.play(this.wellOfMemory);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.endTurn();
            this.player1.clickPrompt('geistoid');
            this.player1.useAction(this.wellOfMemory);
            expect(this.wellOfMemory.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
