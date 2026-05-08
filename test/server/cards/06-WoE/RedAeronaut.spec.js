describe('Red Aeronaut', function () {
    describe("Red Aeronaut's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    discard: ['nautilixian'],
                    hand: ['red-aeronaut']
                }
            });
        });

        it('should cause a search for the nautilixian from discard', function () {
            this.player1.playCreature(this.redAeronaut);
            this.player1.clickCard(this.nautilixian);
            this.player1.clickPrompt('Left');
            expect(this.nautilixian.location).toBe('play area');
        });

        it('should cause a search for the nautilixian from deck', function () {
            this.player1.moveCard(this.nautilixian, 'deck');
            this.player1.playCreature(this.redAeronaut);
            this.player1.clickCard(this.nautilixian);
            this.player1.clickPrompt('Left');
            expect(this.nautilixian.location).toBe('play area');
        });

        it('should not cause a search for the nautilixian if in play', function () {
            this.player1.moveCard(this.nautilixian, 'hand');
            this.player1.playCreature(this.nautilixian);
            this.player1.playCreature(this.redAeronaut);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow the search to fail', function () {
            this.player1.playCreature(this.redAeronaut);
            this.player1.clickPrompt('Done');
            expect(this.nautilixian.location).toBe('discard');
        });

        it('should use its action to modify nautilixian power', function () {
            this.player1.playCreature(this.redAeronaut);
            this.player1.clickCard(this.nautilixian);
            this.player1.clickPrompt('Left');
            this.redAeronaut.ready();
            expect(this.nautilixian.power).toBe(6);
            this.player1.useAction(this.redAeronaut);
            this.player1.clickCard(this.nautilixian);
            expect(this.nautilixian.power).toBe(11);
        });
    });
});
