describe('Summoned Counsel', function () {
    describe("Summoned Counsel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['summoned-counsel'],
                    discard: ['echofly', 'gub', 'ecto-charge']
                },
                player2: {
                    amber: 2,
                    discard: ['lamindra', 'island-of-misfit-toys']
                }
            });

            this.player1.moveCard(this.ectoCharge, 'purged');
            this.player1.moveCard(this.islandOfMisfitToys, 'purged');
            this.player1.reap(this.summonedCounsel);
        });

        it('shuffles a friendly discard card back in', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));

            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.echofly);
            expect(this.echofly.location).toBe('deck');
            expect(this.gub.location).toBe('discard');
            expect(shuffled).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('shuffles a friendly purged card back in', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));

            expect(this.player1).toBeAbleToSelect(this.ectoCharge);
            expect(this.player1).not.toBeAbleToSelect(this.islandOfMisfitToys);
            this.player1.clickCard(this.ectoCharge);
            expect(this.ectoCharge.location).toBe('deck');
            expect(shuffled).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
