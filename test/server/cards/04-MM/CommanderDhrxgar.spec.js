describe('Commander Dhrxgar', function () {
    describe("Commander Dhrxgar's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: [
                        'securi-droid',
                        'commander-dhrxgar',
                        'medic-ingram',
                        'sensor-chief-garcia'
                    ],
                    hand: ['stunner', 'calv-1n']
                },
                player2: {
                    amber: 1,
                    hand: ['detention-coil', 'disruption-field']
                }
            });
        });

        it('should gain 1A when upgrade is attached to it', function () {
            this.player1.playUpgrade(this.stunner, this.commanderDhrxgar);
            expect(this.player1.amber).toBe(2);
        });

        it('should gain 1A when upgrade is attached to any of its neighbors', function () {
            this.player1.playUpgrade(this.stunner, this.medicIngram);
            this.player1.playUpgrade(this.calv1n, this.securiDroid);
            expect(this.player1.amber).toBe(3);
        });

        it('should not gain 1A when upgrade is attached to a non-neighbor', function () {
            this.player1.playUpgrade(this.stunner, this.sensorChiefGarcia);
            expect(this.player1.amber).toBe(1);
        });

        it('should gain 1A when opponent attach upgrade to it or a neighbor', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.playUpgrade(this.detentionCoil, this.commanderDhrxgar);
            this.player2.playUpgrade(this.disruptionField, this.medicIngram);
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(2);
        });
    });
});
