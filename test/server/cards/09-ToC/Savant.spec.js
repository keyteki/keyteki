describe('Savant', function () {
    describe("Savant's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    token: 'savant',
                    hand: ['shooler', 'drumble'],
                    inPlay: ['savant:gub', 'helper-bot'],
                    archives: ['dr-milli']
                },
                player2: {
                    amber: 1
                }
            });

            this.savant = this.player1.player.creaturesInPlay[0];
        });

        it('should be able to put a card from archives into hand on action', function () {
            this.player1.useAction(this.savant);
            expect(this.player1).toBeAbleToSelect(this.drMilli);
            this.player1.clickCard(this.drMilli);
            expect(this.drMilli.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be optional, and instead archive a card', function () {
            this.player1.useAction(this.savant);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.drumble);
            this.player1.clickCard(this.drumble);
            expect(this.drumble.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
