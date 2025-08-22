describe('Ask Again Later', function () {
    describe("Ask Again Later's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'ask-again-later',
                        'expect-the-unexpected',
                        'bad-omen',
                        'heads-i-win'
                    ],
                    hand: ['parasitic-arachnoid', 'gleaming-the-cube'],
                    discard: ['medic-ingram', 'krump']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'urchin'],
                    discard: ['nerve-blast']
                }
            });
        });

        it('should fulfill when revealed card does not match named house', function () {
            this.player1.activateProphecy(this.askAgainLater, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player1.moveCard(this.medicIngram, 'deck');
            this.player2.clickPrompt('dis');
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.amber).toBe(2);
            expect(this.medicIngram.location).toBe('deck');
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow fate to change house on fulfillment', function () {
            this.player1.activateProphecy(this.askAgainLater, this.gleamingTheCube);
            this.player1.endTurn();
            this.player2.moveCard(this.nerveBlast, 'deck');
            this.player2.clickPrompt('brobnar');
            this.player1.moveCard(this.medicIngram, 'deck');
            this.player2.clickPrompt('dis');
            expect(this.nerveBlast.location).toBe('discard');
            this.player2.reap(this.urchin);
            expect(this.player2.amber).toBe(5);
            expect(this.gleamingTheCube.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not fulfill when revealed card matches named house', function () {
            this.player1.activateProphecy(this.askAgainLater, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player1.moveCard(this.medicIngram, 'deck');
            this.player2.clickPrompt('staralliance');
            expect(this.medicIngram.location).toBe('deck');
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should only allow choosing houses from identity', function () {
            this.player1.activateProphecy(this.askAgainLater, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('staralliance');
            expect(this.player2).toHavePromptButton('brobnar');
            expect(this.player2).not.toHavePromptButton('logos');
            expect(this.player2).not.toHavePromptButton('shadows');
            expect(this.player2).not.toHavePromptButton('mars');
        });

        it('should fulfill prophecy when player1 has no cards in deck', function () {
            this.player1.activateProphecy(this.askAgainLater, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player1.player.deck = [];
            this.player2.clickPrompt('brobnar');
            this.player2.clickPrompt('dis');
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
