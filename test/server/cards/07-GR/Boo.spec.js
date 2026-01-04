describe('Boo!', function () {
    describe("Boo!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['boo'],
                    discard: ['charette']
                },
                player2: {
                    discard: ['bot-bookton']
                }
            });
            this.player1.moveCard(this.charette, 'deck');
            this.player2.moveCard(this.botBookton, 'deck');
        });

        it('discards the top 10 of the players deck', function () {
            this.player1.play(this.boo);
            this.player1.clickPrompt('Mine');
            expect(this.player1.player.discard.length).toBe(11);
            expect(this.charette.location).toBe('discard');
            expect(this.player2.player.discard.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('discards the top 10 of the opponents deck', function () {
            this.player1.play(this.boo);
            this.player1.clickPrompt("Opponent's");
            expect(this.player2.player.discard.length).toBe(10);
            expect(this.botBookton.location).toBe('discard');
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can discard fewer than 10 cards', function () {
            this.player1.player.deck = this.player1.player.deck.slice(0, 5);
            this.player1.play(this.boo);
            this.player1.clickPrompt('Mine');
            expect(this.player1.player.discard.length).toBe(6);
            expect(this.charette.location).toBe('discard');
            expect(this.player2.player.discard.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
