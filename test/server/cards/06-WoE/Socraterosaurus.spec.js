describe('Socraterosaurus', function () {
    describe("Socraterosaurus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['curse-of-vanity', 'tribute', 'platopelta'],
                    inPlay: ['socraterosaurus']
                },
                player2: {
                    amber: 1,
                    hand: ['platopelta']
                }
            });

            this.platopelta2 = this.player2.player.hand[0];
        });

        it('draw a card', function () {
            this.player1.reap(this.socraterosaurus);
            expect(this.player1.player.hand.length).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });

        it('place a wisdom counter', function () {
            this.player1.playCreature(this.platopelta, true);
            this.player1.reap(this.socraterosaurus);
            this.player1.clickCard(this.platopelta);
            expect(this.platopelta.tokens.wisdom).toBe(1);
            expect(this.player1.hand.length).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('choose to not place a wisdom counter', function () {
            this.player1.playCreature(this.platopelta, true);
            this.player1.reap(this.socraterosaurus);
            this.player1.clickPrompt('Done');
            expect(this.platopelta.tokens.wisdom).toBe(undefined);
            expect(this.player1.hand.length).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('place a wisdom counter on enemy creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.playCreature(this.platopelta2, true);
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.reap(this.socraterosaurus);
            this.player1.clickCard(this.platopelta2);
            expect(this.platopelta2.tokens.wisdom).toBe(1);
            expect(this.player1.hand.length).toBe(7); // drew at start of turn
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
