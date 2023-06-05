describe('Stronger Together', function () {
    describe("Stronger Together's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    inPlay: [
                        'sensor-chief-garcia',
                        'batdrone',
                        'cr-officer-hawkins',
                        'urchin',
                        'helmsman-spears',
                        'dodger',
                        'explo-rover',
                        'quixo-the-adventurer'
                    ],
                    hand: ['stronger-together']
                }
            });
        });

        it('should ready each staralliance creautre with neighors of two different staralliance houses', function () {
            this.player1.reap(this.sensorChiefGarcia);
            this.player1.reap(this.crOfficerHawkins);
            this.player1.reap(this.helmsmanSpears);
            this.player1.clickPrompt('Done');
            this.player1.reap(this.exploRover);

            this.player1.play(this.strongerTogether);
            expect(this.sensorChiefGarcia.exhausted).toBe(true);
            expect(this.crOfficerHawkins.exhausted).toBe(false);
            expect(this.helmsmanSpears.exhausted).toBe(true);
            expect(this.exploRover.exhausted).toBe(false);
            this.player1.reap(this.crOfficerHawkins);
            this.player1.reap(this.exploRover);
        });
    });
});
