describe('Looping Dirge', function () {
    describe("Looping Dirge's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    token: 'minion',
                    hand: ['looping-dirge', 'a-strong-feeling'],
                    inPlay: ['touchstone'],
                    deck: new Array(12).fill('toad'),
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 1
                }
            });

            this.minion1 = this.player1.player.deck[0];
        });

        it('should do nothing if not haunted', function () {
            this.player1.play(this.loopingDirge);
            expect(this.minion1.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make a token creature if haunted', function () {
            this.player1.scrap(this.aStrongFeeling);
            this.player1.play(this.loopingDirge);
            this.player1.clickPrompt('Left');
            expect(this.minion1.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
