describe('Helichopper', function () {
    describe("Helichopper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['a-strong-feeling'],
                    inPlay: ['helichopper'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 4,
                    inPlay: ['thing-from-the-deep']
                }
            });
            this.player1.chains = 36;
        });

        it('should capture 2 amber as an action', function () {
            this.player1.useAction(this.helichopper);
            expect(this.helichopper.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('gains +2 power when haunted for each amber', function () {
            this.helichopper.amber = 2;
            expect(this.helichopper.power).toBe(5);
            this.player1.scrap(this.aStrongFeeling);
            expect(this.helichopper.power).toBe(11);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
