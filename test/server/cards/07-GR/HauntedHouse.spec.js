describe('Haunted House', function () {
    describe("Haunted House's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['a-strong-feeling'],
                    inPlay: ['haunted-house'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 1
                }
            });
            this.player1.chains = 36;
        });

        it('does nothing on omni if not haunted', function () {
            this.player1.useAction(this.hauntedHouse, true);
            expect(this.player1.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('gains 1 amber on omni if haunted', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.useAction(this.hauntedHouse, true);
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('discards the top card of players deck if not haunted at start of turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.player1.player.discard.length).toBe(10);
            this.player1.clickPrompt('geistoid');
        });

        it('does nothing if not haunted at start of turn', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.player1.player.discard.length).toBe(10);
            this.player1.clickPrompt('geistoid');
        });
    });
});
