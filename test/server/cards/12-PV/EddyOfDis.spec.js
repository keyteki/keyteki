describe('Eddy of Dis', function () {
    describe("Eddy of Dis's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['eddy-of-dis'],
                    discard: ['poltergeist', 'ember-imp']
                },
                player2: {
                    amber: 4,
                    hand: ['mighty-tiger', 'urchin', 'hunting-witch', 'dust-pixie'],
                    inPlay: ['ancient-bear']
                }
            });
        });

        it('should shuffle a random card from opponent hand into their deck when played', function () {
            let deckLen = this.player2.deck.length;
            let shuffled = [];
            this.player1.player.game.on(
                'onDeckShuffled',
                (event) => (shuffled = shuffled.concat([event.player]))
            );
            this.player1.play(this.eddyOfDis);
            expect(this.player2.hand.length).toBe(3);
            expect(this.player2.deck.length).toBe(deckLen + 1);
            expect(this.eddyOfDis.location).toBe('discard');
            expect(shuffled).toContain(this.player2.player);
        });

        it('should shuffle opponent discard pile into deck and draw a card when fate is triggered', function () {
            let shuffled = [];
            this.player1.player.game.on(
                'onDeckShuffled',
                (event) => (shuffled = shuffled.concat([event.player]))
            );
            this.player1.activateProphecy(this.overreach, this.eddyOfDis);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.ancientBear);
            expect(this.player1.discard.length).toBe(1);
            expect(this.poltergeist.location).not.toBe('discard');
            expect(this.emberImp.location).not.toBe('discard');
            expect(this.player1.hand.length).toBe(7);
            expect(this.eddyOfDis.location).toBe('discard');
            expect(shuffled).toContain(this.player1.player);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
