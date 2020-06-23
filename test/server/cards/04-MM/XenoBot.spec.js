describe('Xeno-Bot', function () {
    describe("Xeno-Bots's Reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['xeno-bot', 'old-yurk'],
                    hand: ['soulkeeper']
                },
                player2: {
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });

        it('should discard a card and draw a card when used to reap', function () {
            this.player1.reap(this.xenoBot);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Xeno-Bot');
            expect(this.player1).toBeAbleToSelect(this.soulkeeper);
            this.player1.clickCard(this.soulkeeper);
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.player1.hand.length).toBe(1);
        });

        it("should shouldn't draw a card when used to reap when there is nothing to discard", function () {
            this.player1.moveCard(this.soulkeeper, 'deck');
            this.player1.reap(this.xenoBot);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.clickCard(this.soulkeeper);
            expect(this.soulkeeper.location).toBe('deck');
            expect(this.player1.hand.length).toBe(0);
        });
    });

    describe("Xeno-Bot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['xeno-bot'],
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
            this.player1.fightWith(this.xenoBot, this.lamindra);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt for a single card if deck has only 1 card', function () {
            this.player1.player.deck = [this.archimedes];
            this.player1.fightWith(this.xenoBot, this.lamindra);
            expect(this.player1).toHavePrompt('Choose a card to add to hand');
            expect(this.player1).toHavePromptCardButton(this.archimedes);
            this.player1.clickPrompt('archimedes');
            expect(this.archimedes.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt for a card to go to hand and one to bottom of deck', function () {
            this.player1.fightWith(this.xenoBot, this.lamindra);
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
