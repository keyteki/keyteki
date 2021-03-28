describe('Research Smoko', function () {
    describe("Research Smoko's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['poison-wave'],
                    inPlay: ['research-smoko'],
                    discard: ['phase-shift']
                },
                player2: {
                    amber: 2,
                    inPlay: ['snufflegator']
                }
            });
            this.player1.moveCard(this.phaseShift, 'deck');
        });

        it('should archive the top card of the deck when Smoko dies', function () {
            this.player1.play(this.poisonWave);
            expect(this.researchSmoko.location).toBe('discard');
            expect(this.phaseShift.location).toBe('archives');
            expect(this.player1.archives.length).toBe(1);
        });
    });
});
