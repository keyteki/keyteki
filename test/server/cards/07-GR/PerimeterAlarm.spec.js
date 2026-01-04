describe('Perimeter Alarm', function () {
    describe("Perimeter Alarm's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['perimeter-alarm', 'stealth-mode', 'photon-blast'],
                    inPlay: ['cpo-zytar', 'dust-pixie'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['kelifi-dragon']
                }
            });
        });

        it('allows use of non-SA creature', function () {
            this.player1.play(this.perimeterAlarm);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.kelifiDragon);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(2);
        });

        it('does not archive when not haunted', function () {
            this.player1.play(this.perimeterAlarm);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.perimeterAlarm.location).toBe('discard');
        });

        it('archives when haunted', function () {
            this.player1.play(this.stealthMode);
            this.player1.play(this.perimeterAlarm);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.perimeterAlarm.location).toBe('archives');
        });

        it('archives when haunted no creatures are used', function () {
            this.player1.play(this.photonBlast);
            this.player1.clickCard(this.dustPixie);
            this.player1.play(this.perimeterAlarm);
            expect(this.perimeterAlarm.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
