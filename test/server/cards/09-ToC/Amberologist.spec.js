describe('Amberologist', function () {
    describe("Amberologist's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    token: 'æmberologist',
                    inPlay: ['æmberologist:toad', 'touchstone']
                },
                player2: {
                    amber: 2
                }
            });

            this.amberologist = this.player1.player.creaturesInPlay[0];
        });

        it('should capture 1 on action', function () {
            this.player1.useAction(this.amberologist);
            expect(this.amberologist.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
