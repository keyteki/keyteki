describe('Long Way Home', function () {
    describe("Long Way Home's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['long-way-home'],
                    inPlay: ['aero-o-fore', 'black-tempest', 'charette']
                },
                player2: {
                    inPlay: ['lamindra', 'nantucket']
                }
            });
        });

        it('should archive each friendly Skyborn creature', function () {
            this.player1.play(this.longWayHome);
            expect(this.aeroOFore.location).toBe('archives');
            expect(this.blackTempest.location).toBe('archives');
            expect(this.charette.location).toBe('play area'); // Not Skyborn
            expect(this.lamindra.location).toBe('play area'); // Enemy creature
            expect(this.nantucket.location).toBe('play area'); // Enemy Skyborn creature
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
