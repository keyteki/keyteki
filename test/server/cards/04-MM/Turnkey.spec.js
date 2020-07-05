describe('Turnkey', function () {
    describe("Turnkey's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['turnkey', 'gongoozle']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it("should not unforge and reforge an opponent's key when they have no keys", function () {
            this.player1.play(this.turnkey);
            this.player1.play(this.gongoozle);
            this.player1.clickCard(this.turnkey);

            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should unforge an opponent's key when they have one", function () {
            this.player2.player.keys = { red: false, blue: true, yellow: false };
            this.player1.play(this.turnkey);

            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should unforge an opponent's key when they have two", function () {
            this.player2.player.keys = { red: true, blue: true, yellow: false };

            this.player1.play(this.turnkey);
            expect(this.player1).toHavePrompt('Unforge a key');
            expect(this.player1).toHavePromptButton('Red');
            expect(this.player1).toHavePromptButton('Blue');
            expect(this.player1).not.toHavePromptButton('Yellow');
            this.player1.clickPrompt('Blue');

            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player2.amber).toBe(0);
        });

        it("should reforge an opponent's key when leaving play during controller's turn", function () {
            this.player2.player.keys = { red: true, blue: true, yellow: false };

            this.player1.play(this.turnkey);
            this.player1.clickPrompt('Blue');
            this.player1.play(this.gongoozle);
            this.player1.clickCard(this.turnkey);

            //Odd wording, because your opponent is the one who actually gets the key.
            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            expect(this.player1).not.toHavePromptButton('Red');
            expect(this.player1).toHavePromptButton('Blue');
            expect(this.player1).toHavePromptButton('Yellow');
            this.player1.clickPrompt('Yellow');

            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player2.amber).toBe(0);
        });

        it("should reforge an opponent's key when leaving play during opponent's turn", function () {
            this.player2.player.keys = { red: true, blue: true, yellow: false };

            this.player1.play(this.turnkey);
            this.player1.clickPrompt('Blue');
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.bumpsy, this.turnkey);

            //Odd wording, because your opponent is the one who actually gets the key.
            expect(this.player2).toHavePrompt('Which key would you like to forge?');
            expect(this.player2).not.toHavePromptButton('Red');
            expect(this.player2).toHavePromptButton('Blue');
            expect(this.player2).toHavePromptButton('Yellow');
            this.player2.clickPrompt('Yellow');

            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(true);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player2.amber).toBe(0);
        });
    });
});
