describe('Steadfast Commitment', function () {
    describe("Steadfast Commitment's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'redemption',
                    token: 'zealot',
                    hand: ['steadfast-commitment'],
                    inPlay: ['dust-pixie'],
                    deck: new Array(12).fill('toad'),
                    discard: ['troll', 'krump']
                },
                player2: {
                    amber: 1
                }
            });

            this.zealot1 = this.player1.player.deck[0];
        });

        it('should put top card of discard on bottom of deck and make a token creature', function () {
            this.player1.play(this.steadfastCommitment);
            this.player1.clickPrompt('Right');
            expect(this.troll.location).toBe('deck');
            expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(this.troll);
            expect(this.zealot1.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should make a token with an empty discard', function () {
            this.player1.player.discard = [];
            this.player1.play(this.steadfastCommitment);
            this.player1.clickPrompt('Right');
            expect(this.zealot1.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should make a token out of the moved card if deck is empty', function () {
            this.player1.player.deck = [];
            this.player1.play(this.steadfastCommitment);
            this.player1.clickPrompt('Right');
            expect(this.troll.location).toBe('play area');
            expect(this.troll.name).toBe('Zealot');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
