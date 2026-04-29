describe('Shadys', function () {
    describe("Shadys's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    inPlay: ['shadys'],
                    discard: ['purse-a-phone', 'charette', 'control-the-weak']
                },
                player2: {
                    amber: 4,
                    discard: ['gub']
                }
            });
        });

        it('can play a creature from discard', function () {
            this.player1.useAction(this.shadys);
            expect(this.player1).toBeAbleToSelect(this.purseAPhone);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.controlTheWeak);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            this.player1.clickCard(this.charette);
            this.player1.clickPrompt('Right');
            expect(this.charette.location).toBe('play area');
            expect(this.charette.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('destroys self when choosing Purse-A-Phone', function () {
            this.player1.useAction(this.shadys);
            this.player1.clickCard(this.purseAPhone);
            this.player1.clickPrompt('Right');
            expect(this.purseAPhone.location).toBe('play area');
            expect(this.shadys.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
