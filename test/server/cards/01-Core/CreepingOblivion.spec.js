describe('Creeping Oblivion', function () {
    describe("Creeping Oblivion's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['creeping-oblivion', 'shaffles']
                },
                player2: {
                    discard: ['krump', 'urchin', 'dodger']
                }
            });
        });

        it("should allow player to purge up to 2 cards from player's discard", function () {
            this.player1.scrap(this.shaffles);
            this.player1.play(this.creepingOblivion);
            expect(this.player1).toHavePrompt('Choose which discard pile to purge from');
            this.player1.clickPrompt('Mine');
            expect(this.player1).toBeAbleToSelect(this.shaffles);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.shaffles);
            this.player1.clickPrompt('Done');
            expect(this.shaffles.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow player to purge up to 2 cards from opponent discard', function () {
            this.player1.scrap(this.shaffles);
            this.player1.play(this.creepingOblivion);
            this.player1.clickPrompt("Opponent's");
            expect(this.player1).not.toBeAbleToSelect(this.shaffles);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Done');
            expect(this.krump.location).toBe('purged');
            expect(this.urchin.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow player to purge nothing', function () {
            this.player1.play(this.creepingOblivion);
            this.player1.clickPrompt('Done');
            expect(this.shaffles.location).toBe('hand');
            expect(this.krump.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.dodger.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
