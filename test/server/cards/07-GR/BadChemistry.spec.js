describe('Bad Chemistry', function () {
    describe("Bad Chemistry's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['bad-chemistry'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: [
                        'timetraveller',
                        'subject-kirby',
                        'commander-chan',
                        'batdrone',
                        'medic-ingram',
                        'cpo-zytar'
                    ]
                }
            });
        });

        it('should stun creatures who share a house with a neighbor', function () {
            this.player1.play(this.badChemistry);
            expect(this.dustPixie.stunned).toBe(false);
            expect(this.timetraveller.stunned).toBe(false);
            expect(this.subjectKirby.stunned).toBe(true);
            expect(this.commanderChan.stunned).toBe(true);
            expect(this.batdrone.stunned).toBe(false);
            expect(this.medicIngram.stunned).toBe(true);
            expect(this.cpoZytar.stunned).toBe(true);
        });
    });
});
