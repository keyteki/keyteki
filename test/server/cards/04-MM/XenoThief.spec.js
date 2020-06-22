describe('Xeno-Thief', function () {
    describe("Xeno-Thief's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['xeno-thief'],
                    hand: ['eyegor', 'titan-mechanic', 'archimedes'],
                    amber: 4
                },
                player2: {
                    amber: 1,
                    inPlay: ['lamindra', 'shooler', 'troll']
                }
            });

            this.player1.moveCard(this.eyegor, 'deck');
            this.player1.moveCard(this.titanMechanic, 'deck');
            this.player1.moveCard(this.archimedes, 'deck');
        });

        it('should not prompt for cards is deck is empty', function () {
            this.player1.player.deck = [];
            this.player1.fightWith(this.xenoThief, this.lamindra);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt for a single card if deck has only 1 card', function () {
            this.player1.player.deck = [this.archimedes];
            this.player1.fightWith(this.xenoThief, this.lamindra);
            expect(this.player1).toHavePrompt('Choose a card to add to hand');
            expect(this.player1).toHavePromptCardButton(this.archimedes);
            this.player1.clickPrompt('archimedes');
            expect(this.archimedes.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt for a card to go to hand and one to bottom of deck', function () {
            this.player1.fightWith(this.xenoThief, this.lamindra);
            expect(this.player1).toHavePrompt('Choose a card to add to hand');
            expect(this.player1).toHavePromptCardButton(this.eyegor);
            expect(this.player1).toHavePromptCardButton(this.archimedes);
            expect(this.player1).toHavePromptCardButton(this.titanMechanic);
            this.player1.clickPrompt('archimedes');
            expect(this.archimedes.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to move to bottom of deck');
            expect(this.player1).toHavePromptCardButton(this.eyegor);
            expect(this.player1).toHavePromptCardButton(this.titanMechanic);
            this.player1.clickPrompt('eyegor');
            expect(this.player1.player.deck[0]).toBe(this.titanMechanic);
            expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(this.eyegor);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
