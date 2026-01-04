describe('Spoo-key Charge', function () {
    describe("Spoo-key Charge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'untamed',
                    hand: ['spoo-key-charge', 'the-common-cold'],
                    inPlay: ['dust-pixie'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
        });

        it('does not forge if you are not haunted, but still shuffles', function () {
            this.player1.reap(this.dustPixie);
            let deckLen = this.player1.player.deck.length;
            this.player1.play(this.spooKeyCharge);
            expect(this.player1).isReadyToTakeAction();
            expect(this.spooKeyCharge.location).toBe('discard');
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player1.player.deck.length).toBe(deckLen + 9);
            expect(this.player1.amber).toBe(6);
        });

        it('does not forge if you are haunted but without enough amber', function () {
            this.player1.clickCard(this.theCommonCold);
            this.player1.clickPrompt('Discard this card');
            let deckLen = this.player1.player.deck.length;
            this.player1.play(this.spooKeyCharge);
            expect(this.player1).isReadyToTakeAction();
            expect(this.spooKeyCharge.location).toBe('discard');
            expect(this.theCommonCold.location).toBe('deck');
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player1.player.deck.length).toBe(deckLen + 9 + 1);
            expect(this.player1.amber).toBe(5);
        });

        it('forges if you are haunted', function () {
            this.player1.play(this.theCommonCold);
            let deckLen = this.player1.player.deck.length;
            this.player1.play(this.spooKeyCharge);
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
            expect(this.spooKeyCharge.location).toBe('discard');
            expect(this.dustPixie.location).toBe('deck');
            expect(this.theCommonCold.location).toBe('deck');
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player1.player.deck.length).toBe(deckLen + 9 + 2);
        });
    });
});
