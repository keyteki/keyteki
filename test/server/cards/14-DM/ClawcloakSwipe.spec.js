describe('Clawcloak Swipe', function () {
    describe("Clawcloak Swipe's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    amber: 0,
                    hand: ['clawcloak-swipe'],
                    inPlay: ['caspart']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'urchin', 'bumpsy']
                }
            });
        });

        it('captures 2 per excess opponent creature when overwhelmed', function () {
            this.player1.play(this.clawcloakSwipe);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.caspart);
            // 3 opponents - 1 friendly = 2 excess; capture 2 per excess = 2 capture amount
            expect(this.caspart.tokens.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot be played when not overwhelmed', function () {
            this.player2.moveCard(this.troll, 'discard');
            this.player2.moveCard(this.urchin, 'discard');
            this.player1.play(this.clawcloakSwipe);
            // not overwhelmed - condition false, no target prompt
            expect(this.caspart.tokens.amber).toBeUndefined();
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
