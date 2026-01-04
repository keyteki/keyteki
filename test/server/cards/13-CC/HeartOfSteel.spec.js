describe('Heart of Steel', function () {
    describe("Heart of Steel's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['heart-of-steel'],
                    discard: ['aero-o-fore', 'black-tempest', 'charette']
                },
                player2: {
                    inPlay: ['lamindra'],
                    discard: ['bux-bastian']
                }
            });
        });

        it('should play a Skyborn creature from discard', function () {
            this.player1.play(this.heartOfSteel);
            expect(this.player1).toBeAbleToSelect(this.aeroOFore);
            expect(this.player1).toBeAbleToSelect(this.blackTempest);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.buxBastian);
            this.player1.clickCard(this.aeroOFore);
            expect(this.aeroOFore.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay).toContain(this.aeroOFore);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
