describe('Reservist Jones', function () {
    describe("Reservist Jones's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['reservist-jones', 'cpo-zytar', 'sensor-chief-garcia'],
                    inPlay: ['ember-imp', 'krump']
                },
                player2: {
                    amber: 6,
                    inPlay: ['troll', 'brammo']
                }
            });
        });

        it('should capture 2 amber for 1 non-Star Alliance neighbor', function () {
            this.player1.playCreature(this.reservistJones);
            expect(this.player2.amber).toBe(4);
            expect(this.reservistJones.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should capture 4 amber for 2 non-Star Alliance neighbors', function () {
            this.player1.playCreature(this.reservistJones, false, true);
            this.player1.clickCard(this.emberImp);
            expect(this.player2.amber).toBe(2);
            expect(this.reservistJones.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should capture 2 amber for 1 non-Star Alliance neighbor and 1 Star Alliance neighbor', function () {
            this.player1.playCreature(this.sensorChiefGarcia);
            this.player1.playCreature(this.reservistJones, false, true);
            this.player1.clickCard(this.krump);
            expect(this.player2.amber).toBe(4);
            expect(this.reservistJones.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should capture 0 amber for 2 Star Alliance neighbors', function () {
            this.player1.playCreature(this.sensorChiefGarcia);
            this.player1.playCreature(this.cpoZytar);
            this.player1.playCreature(this.reservistJones, false, true);
            this.player1.clickCard(this.cpoZytar);
            expect(this.player2.amber).toBe(6);
            expect(this.reservistJones.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
