describe('BorrNit', function () {
    describe("BorrNit's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'dis',
                    inPlay: ['borr-nit'],
                    hand: ['lamindra', 'shooler', 'gub', 'dextre', 'archimedes', 'spyyyder']
                },
                player2: {
                    amber: 5,
                    hand: ['urchin', 'swindle', 'bad-penny', 'smith', 'krump', 'groggins', 'troll']
                }
            });

            for (let card of this.player1.player.hand) {
                this.player1.moveCard(card, 'deck');
            }

            for (let card of this.player2.player.hand) {
                this.player2.moveCard(card, 'deck');
            }
        });

        it('should prompt which player discard', function () {
            this.player1.reap(this.borrNit);
            expect(this.player1).toHavePrompt('Borr Nit');
            expect(this.player1).toHavePromptButton('Mine');
            expect(this.player1).toHavePromptButton("Opponent's");
        });

        it("should allow selecting top 5 of player's deck", function () {
            this.player1.reap(this.borrNit);
            this.player1.clickPrompt('Mine');
            expect(this.player1).toHavePrompt('Choose which card to purge');
            expect(this.player1).toHavePromptCardButton(this.spyyyder);
            expect(this.player1).toHavePromptCardButton(this.archimedes);
            expect(this.player1).toHavePromptCardButton(this.dextre);
            expect(this.player1).toHavePromptCardButton(this.gub);
            expect(this.player1).toHavePromptCardButton(this.shooler);
            expect(this.player1).not.toHavePromptCardButton(this.lamindra);
        });

        it("should allow selecting top 5 of opponent's deck", function () {
            this.player1.reap(this.borrNit);
            this.player1.clickPrompt("Opponent's");
            expect(this.player1).toHavePrompt('Choose which card to purge');
            expect(this.player1).toHavePromptCardButton(this.troll);
            expect(this.player1).toHavePromptCardButton(this.groggins);
            expect(this.player1).toHavePromptCardButton(this.krump);
            expect(this.player1).toHavePromptCardButton(this.smith);
            expect(this.player1).toHavePromptCardButton(this.badPenny);
            expect(this.player1).not.toHavePromptCardButton(this.swindle);
            expect(this.player1).not.toHavePromptCardButton(this.urchin);
        });

        it("should purge a card from player's deck", function () {
            this.player1.reap(this.borrNit);
            this.player1.clickPrompt('Mine');
            this.player1.clickPrompt(this.archimedes.name);
            expect(this.archimedes.location).toBe('purged');
        });

        it("should purge a card from opponent's deck", function () {
            this.player1.reap(this.borrNit);
            this.player1.clickPrompt("Opponent's");
            this.player1.clickPrompt(this.smith.name);
            expect(this.smith.location).toBe('purged');
        });

        it("should shuffle player's deck", function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.reap(this.borrNit);
            this.player1.clickPrompt('Mine');
            this.player1.clickPrompt(this.archimedes.name);
            expect(shuffled).toBe(this.player1.player);
        });

        it("should shuffle opponent's deck", function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.reap(this.borrNit);
            this.player1.clickPrompt("Opponent's");
            this.player1.clickPrompt(this.smith.name);
            expect(shuffled).toBe(this.player2.player);
        });
    });
});
