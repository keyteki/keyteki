describe('Reiteration', function () {
    describe("Reiteration's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['reiteration', 'flaxia', 'searine', 'batdrone']
                },
                player2: {
                    hand: ['troll', 'krump', 'anger'],
                    inPlay: ['ember-imp']
                }
            });
        });

        it('should draw 2 cards and put 2 cards on bottom of deck when played', function () {
            let p1DeckLength = this.player1.deck.length;
            this.player1.play(this.reiteration);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.searine);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.searine);
            expect(this.player1.hand.length).toBe(3); // 4 initial - 1 played + 2 drawn - 2 returned to deck
            expect(this.player1.deck.length).toBe(p1DeckLength); // 2 initial -2 drawn + 2 returned
            expect(this.player1.deck[this.player1.deck.length - 2]).toBe(this.flaxia);
            expect(this.player1.deck[this.player1.deck.length - 1]).toBe(this.searine);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard 2 random cards from hand when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.reiteration);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            let p2HandLength = this.player2.hand.length;
            let p2DiscardLength = this.player2.discard.length;
            this.player2.reap(this.emberImp);
            expect(this.player2.hand.length).toBe(p2HandLength - 2); // 4 initial - 2 discarded
            expect(this.player2.discard.length).toBe(p2DiscardLength + 2); // 2 initial + 2 discarded
            expect(this.reiteration.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
