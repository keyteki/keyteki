describe('Hamstrung', function () {
    describe("Hamstrung's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['hamstrung'],
                    discard: ['ancient-bear', 'infinity-strop']
                },
                player2: {
                    discard: ['hunting-witch', 'key-charge']
                }
            });
        });

        it('should discard top card and purge it if it is a creature', function () {
            this.player1.moveCard(this.ancientBear, 'deck');
            this.player1.play(this.hamstrung);
            this.player1.clickPrompt('Mine');
            expect(this.ancientBear.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard top card and not purge it if it is not a creature', function () {
            this.player1.moveCard(this.infinityStrop, 'deck');
            this.player1.play(this.hamstrung);
            this.player1.clickPrompt('Mine');
            expect(this.infinityStrop.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work on opponent deck for a creature', function () {
            this.player2.moveCard(this.huntingWitch, 'deck');
            this.player1.play(this.hamstrung);
            this.player1.clickPrompt("Opponent's");
            expect(this.huntingWitch.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not work on opponent deck for a non-creature', function () {
            this.player2.moveCard(this.keyCharge, 'deck');
            this.player1.play(this.hamstrung);
            this.player1.clickPrompt("Opponent's");
            expect(this.keyCharge.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing if the deck is empty', function () {
            let p1DeckLen = this.player1.deck.length;
            this.player2.player.deck = [];
            this.player1.play(this.hamstrung);
            this.player1.clickPrompt("Opponent's");
            expect(this.player1.deck.length).toBe(p1DeckLen);
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
