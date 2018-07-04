describe('Oracle of Stone', function() {
    integration(function() {
        describe('Oracle of Stone\'s effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        hand: ['oracle-of-stone', 'charge', 'spyglass']
                    },
                    player2: {
                        hand: ['mantra-of-fire', 'mantra-of-water']
                    }
                });
                this.oracleOfStone = this.player1.findCardByName('oracle-of-stone');
            });

            it('should make each player 2 cards', function() {
                let hand = this.player1.hand.length;
                let conflictDeck = this.player1.conflictDeck.length;
                let hand2 = this.player2.hand.length;
                let conflictDeck2 = this.player2.conflictDeck.length;
                this.player1.clickCard(this.oracleOfStone);

                expect(this.player1.hand.length).toBe(hand + 1);
                expect(this.player1.conflictDeck.length).toBe(conflictDeck - 2);
                expect(this.player2.hand.length).toBe(hand2 + 2);
                expect(this.player2.conflictDeck.length).toBe(conflictDeck2 - 2);
            });

            it('should make each player discard 2 cards', function() {
                this.player1.clickCard(this.oracleOfStone);
                let hand1 = this.player1.hand.length;
                let charge = this.player1.clickCard('charge', 'hand');
                let spyglass = this.player1.clickCard('spyglass', 'hand');
                this.player1.clickPrompt('Done');
                let hand2 = this.player2.hand.length;
                let mantraOfFire = this.player2.clickCard('mantra-of-fire', 'hand');
                let mantraOfWater = this.player2.clickCard('mantra-of-water', 'hand');
                this.player2.clickPrompt('Done');

                expect(this.player1.hand.length).toBe(hand1 - 2);
                expect(charge.location).toBe('conflict discard pile');
                expect(spyglass.location).toBe('conflict discard pile');
                expect(this.player2.hand.length).toBe(hand2 - 2);
                expect(mantraOfFire.location).toBe('conflict discard pile');
                expect(mantraOfWater.location).toBe('conflict discard pile');
            });
        });
    });
});
