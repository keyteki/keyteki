describe('Dammater', function () {
    describe("Dammater's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['dammater', 'troll', 'lamindra', 'bumpsy', 'krump', 'anger']
                },
                player2: {}
            });
        });

        it('draws 3, discards 2 chosen, archives 1 chosen', function () {
            const startingHand = this.player1.player.hand.length;
            this.player1.play(this.dammater);
            expect(this.player1.player.hand.length).toBe(startingHand - 1 + 3);
            expect(this.player1).toHavePrompt('Choose {{amount}} cards to discard');
            for (const card of this.player1.player.hand) {
                expect(this.player1).toBeAbleToSelect(card);
            }
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.lamindra);
            this.player1.clickPrompt('Done');
            expect(this.troll.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to archive');
            for (const card of this.player1.player.hand) {
                expect(this.player1).toBeAbleToSelect(card);
            }
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Dammater with empty deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['dammater', 'troll', 'lamindra', 'bumpsy', 'krump', 'anger']
                },
                player2: {}
            });
            for (const card of [...this.player1.player.deck]) {
                this.player1.moveCard(card, 'discard');
            }
        });

        it('still requires discarding 2 and archiving 1 when no cards are drawn', function () {
            this.player1.play(this.dammater);
            expect(this.player1).toHavePrompt('Choose {{amount}} cards to discard');
            for (const card of this.player1.player.hand) {
                expect(this.player1).toBeAbleToSelect(card);
            }
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.lamindra);
            this.player1.clickPrompt('Done');
            expect(this.troll.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to archive');
            for (const card of this.player1.player.hand) {
                expect(this.player1).toBeAbleToSelect(card);
            }
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
