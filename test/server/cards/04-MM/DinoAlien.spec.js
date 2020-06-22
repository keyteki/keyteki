describe('Dino-Alien', function () {
    describe("Dino-Alien's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['dino-alien', 'eyegor', 'titan-mechanic', 'archimedes'],
                    amber: 4
                },
                player2: {
                    amber: 1,
                    inPlay: ['lamindra', 'shooler', 'troll']
                }
            });
        });

        it('should choose to not exalt after play', function () {
            this.player1.play(this.dinoAlien);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should choose to exalt after play', function () {
            this.player1.play(this.dinoAlien);
            this.player1.clickCard(this.dinoAlien);
            expect(this.player1).toBeAbleToSelect(this.dinoAlien);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.shooler);
            expect(this.dinoAlien.amber).toBe(1);
            expect(this.shooler.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Dino-Alien's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['dino-alien'],
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
            this.player1.fightWith(this.dinoAlien, this.lamindra);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt for a single card if deck has only 1 card', function () {
            this.player1.player.deck = [this.archimedes];
            this.player1.fightWith(this.dinoAlien, this.lamindra);
            expect(this.player1).toHavePrompt('Choose a card to add to hand');
            expect(this.player1).toHavePromptCardButton(this.archimedes);
            this.player1.clickPrompt('archimedes');
            expect(this.archimedes.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt for a card to go to hand and one to bottom of deck', function () {
            this.player1.fightWith(this.dinoAlien, this.lamindra);
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
