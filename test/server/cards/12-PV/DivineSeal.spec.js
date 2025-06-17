describe('Divine Seal', function () {
    describe("Divine Seal's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['divine-seal'],
                    inPlay: ['ember-imp']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump'],
                    discard: ['troll']
                }
            });
        });

        it('should put a creature on the bottom of its owner deck when played', function () {
            this.player1.play(this.divineSeal);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('deck');
            expect(this.player2.player.deck[this.player2.player.deck.length - 1]).toBe(this.krump);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should purge the bottom card of your deck when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.divineSeal);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.moveCard(this.troll, 'deck');
            const bottomDeck = this.player2.deck[this.player2.deck.length - 1];
            this.player2.player.deck[this.player2.player.deck.length - 1] = this.troll;
            this.player2.player.deck[0] = bottomDeck;
            this.player2.reap(this.krump);
            expect(this.troll.location).toBe('purged');
            expect(this.divineSeal.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
