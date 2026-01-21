describe('Replicator', function () {
    describe("Replicator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['replicator', 'dextre']
                },
                player2: {
                    amber: 2,
                    inPlay: ['sequis']
                }
            });
        });

        it('should trigger another creature reap effect', function () {
            this.player1.reap(this.replicator);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            this.player1.clickCard(this.sequis);
            expect(this.sequis.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not be able to select itself', function () {
            this.player1.reap(this.replicator);
            expect(this.player1).not.toBeAbleToSelect(this.replicator);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
