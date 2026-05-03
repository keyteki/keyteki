describe('Noxious Ionox', function () {
    describe("Noxious Ionox's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['noxious-ionox']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('destroys an enemy creature at start of turn if exhausted', function () {
            this.noxiousIonox.exhaust();
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('ouboros');
            expect(this.troll.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if not exhausted', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('ouboros');
            expect(this.troll.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
