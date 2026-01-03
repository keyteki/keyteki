describe('Nogi Smartfist', function () {
    describe("Nogi Smartfist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['nogi-smartfist']
                },
                player2: {
                    inPlay: ['duskwitch'],
                    hand: ['foggify']
                }
            });
        });

        it('should draw 2 cards and discard 2 cards when fight', function () {
            this.player1.fightWith(this.nogiSmartfist, this.duskwitch);
            expect(this.player1.player.discard.length).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe('with HazardZerp cards', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['nogi-smartfist'],
                    hand: ['hazard-zerp'],
                    discard: ['hazard-zerp', 'anger']
                },
                player2: {
                    inPlay: ['duskwitch', 'troll'],
                    hand: ['foggify']
                }
            });
        });

        it('should allow card-discarding scrap abilities during random discard', function () {
            this.player1.moveCard(this.player1.discard[0], 'deck');
            this.player1.moveCard(this.player1.discard[0], 'deck');

            // Fight with Nogi Smartfist.  Zerp and Anger will be drawn to hand.
            // At least one Zerp will be discarded.  At that point, we click on anger
            // if it is still in hand.  If we aer able to do that, then in all cases
            // the second Zerp will also be discarded, leaving the player with an
            // empty hand and 3 cards in discard.
            this.player1.fightWith(this.nogiSmartfist, this.duskwitch);
            if (this.player1.player.hand.includes(this.anger)) {
                this.player1.clickCard(this.anger);
                // Note: in old versions of RandomDiscardAction, it would choose
                // the cards to discard first, and so clicking on Anger when it
                // was already going to be discarded meant that the second Zerp
                // would remain in hand.  If we have a regression there, this test
                // will sometimes fail.
            } else {
                // Anger was discarded first, so we have to click on the second Zerp
                this.player1.clickCard(this.player1.player.hand[0]);
            }
            this.player1.clickCard(this.troll); // zerp damage
            this.player1.clickCard(this.troll); // zerp damage

            expect(this.player1.player.discard.length).toBe(3);
            expect(this.player1.hand.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
