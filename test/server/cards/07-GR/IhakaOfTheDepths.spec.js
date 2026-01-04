describe('Ihaka of the Depths', function () {
    describe("Ihaka of the Depths's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['hallafest', 'standardized-testing'],
                    discard: ['vulka', 'poke', 'bubbles', 'troll'],
                    inPlay: ['ihaka-of-the-depths', 'doc-bookton']
                },
                player2: {
                    hand: ['punctuated-equilibrium'],
                    inPlay: ['thoughtcatcher']
                }
            });
            this.player1.moveCard(this.vulka, 'deck');
        });

        it('should trigger on a draw', function () {
            this.player1.reap(this.docBookton);
            this.player1.clickCard(this.ihakaOfTheDepths);
            expect(this.poke.location).toBe('deck');
            expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(this.poke);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be optional', function () {
            this.player1.reap(this.docBookton);
            this.player1.clickPrompt('Done');
            expect(this.poke.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not trigger when choosing a card from the deck', function () {
            this.player1.chains = 36;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.hallafest);
            this.player1.clickCard(this.vulka);
            this.player1.clickPrompt('Done');
            expect(this.poke.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should trigger on end-of-turn draws', function () {
            this.player1.endTurn();
            this.player1.clickCard(this.ihakaOfTheDepths);
            this.player1.clickCard(this.ihakaOfTheDepths);
            this.player1.clickCard(this.ihakaOfTheDepths);
            expect(this.poke.location).toBe('deck');
            expect(this.player1.player.deck[this.player1.player.deck.length - 3]).toBe(this.poke);
            expect(this.bubbles.location).toBe('deck');
            expect(this.player1.player.deck[this.player1.player.deck.length - 2]).toBe(
                this.bubbles
            );
            expect(this.troll.location).toBe('deck');
            expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(this.troll);
            this.player2.clickPrompt('untamed');
        });

        it('should not trigger on opponents turn', function () {
            this.player1.chains = 36;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.punctuatedEquilibrium);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not trigger when opponent draws during our turn', function () {
            let p2len = this.player2.player.hand.length;
            this.thoughtcatcher.amber = 1;
            this.player1.play(this.standardizedTesting);
            expect(this.thoughtcatcher.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2.player.hand.length).toBe(p2len + 1);
        });
    });
});
