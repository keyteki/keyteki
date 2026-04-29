describe('Fandangle', function () {
    describe("Fandangle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    inPlay: ['fandangle'],
                    hand: ['phase-shift', 'hunting-witch', 'dextre', 'anomaly-exploiter']
                },
                player2: {
                    amber: 2,
                    hand: ['remote-access']
                }
            });
        });

        it('should not ready creatures if less than 4A', function () {
            this.player1.play(this.dextre);
            this.player1.play(this.phaseShift);
            this.player1.play(this.huntingWitch);
            expect(this.dextre.exhausted).toBe(true);
            expect(this.huntingWitch.exhausted).toBe(true);
        });

        it('should ready non-Untamed creatures if 4A', function () {
            this.player1.player.amber = 4;
            this.player1.play(this.dextre);
            this.player1.play(this.phaseShift);
            this.player1.play(this.huntingWitch);
            expect(this.dextre.exhausted).toBe(false);
            expect(this.huntingWitch.exhausted).toBe(true);
        });

        it('should ready non-Untamed creatures if more than 4A', function () {
            this.player1.player.amber = 5;
            this.player1.play(this.dextre);
            this.player1.play(this.phaseShift);
            this.player1.play(this.huntingWitch);
            expect(this.dextre.exhausted).toBe(false);
            expect(this.huntingWitch.exhausted).toBe(true);
        });

        it('should ready non-Untamed artifacts if more than 4A', function () {
            this.player1.player.amber = 5;
            this.player1.play(this.anomalyExploiter);
            expect(this.anomalyExploiter.exhausted).toBe(true);
        });
    });

    describe("Fandangle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'untamed',
                    inPlay: ['fandangle'],
                    hand: ['duskwitch']
                },
                player2: {
                    amber: 4,
                    house: 'logos',
                    hand: ['dextre']
                }
            });
        });

        it('should NOT ready creatures played by the opponent', function () {
            this.player1.play(this.duskwitch);
            this.player2.clickPrompt('logos');
            this.player2.play(this.dextre);
            expect(this.dextre.exhausted).toBe(true);
        });
    });

    describe("Fandangle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'staralliance',
                    inPlay: ['explo-rover'],
                    hand: ['fandangle', 'doctor-driscoll', 'kartanoo']
                },
                player2: {
                    amber: 4,
                    house: 'logos',
                    hand: ['dextre']
                }
            });
        });

        it('should ready itself when maverick', function () {
            this.player1.makeMaverick(this.fandangle, 'staralliance');

            this.player1.play(this.kartanoo);
            expect(this.kartanoo.exhausted).toBe(true);
            this.player1.play(this.fandangle);
            expect(this.fandangle.exhausted).toBe(false);
            this.player1.play(this.doctorDriscoll);
            expect(this.doctorDriscoll.exhausted).toBe(false);
        });

        it('should NOT ready itself when maverick but not enough amber', function () {
            this.player1.player.amber = 0;

            this.player1.makeMaverick(this.fandangle, 'staralliance');

            this.player1.play(this.kartanoo);
            expect(this.kartanoo.exhausted).toBe(true);
            this.player1.play(this.fandangle);
            expect(this.fandangle.exhausted).toBe(true);
            this.player1.play(this.doctorDriscoll);
            expect(this.doctorDriscoll.exhausted).toBe(true);
        });
    });

    describe("Fandangle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'untamed',
                    inPlay: ['explo-rover'],
                    hand: ['fandangle', 'doctor-driscoll', 'kartanoo']
                },
                player2: {
                    amber: 4,
                    house: 'logos',
                    hand: ['dextre']
                }
            });
        });

        it('should NOT ready itself when house is untamed', function () {
            this.player1.play(this.fandangle);
            expect(this.fandangle.exhausted).toBe(true);
        });
    });
});
