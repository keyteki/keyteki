describe('Conclave Witch', function () {
    describe("Conclave Witch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['conclave-witch', 'bad-penny', 'snufflegator'],
                    hand: ['dew-faerie']
                },
                player2: {
                    inPlay: ['krump', 'troll']
                }
            });
        });

        it('should gain 1 amber for each friendly Untamed creature', function () {
            this.player1.useAction(this.conclaveWitch);
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should count played cards', function () {
            this.player1.playCreature(this.dewFaerie);
            this.player1.useAction(this.conclaveWitch);
            expect(this.player1.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
