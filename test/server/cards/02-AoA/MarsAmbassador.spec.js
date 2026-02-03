describe('Mars Ambassador', function () {
    describe("Mars Ambassador's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: [
                        'collector-worm',
                        'shatter-storm',
                        'mothergun',
                        'virtuous-works',
                        'barrister-joya',
                        'brain-stem-antenna'
                    ],
                    inPlay: [
                        'mars-ambassador',
                        'bulwark',
                        'challe-the-safeguard',
                        'glyxl-proliferator',
                        'invasion-portal'
                    ]
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'urchin', 'redlock']
                }
            });
        });

        it('should let play a mars upgrade after reap', function () {
            this.player1.reap(this.marsAmbassador);
            this.player1.playUpgrade(this.brainStemAntenna, this.bulwark);
            expect(this.brainStemAntenna.parent).toBe(this.bulwark);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a mars action after reap', function () {
            this.player1.amber = 3;
            this.player2.amber = 5;
            this.player1.reap(this.marsAmbassador);
            this.player1.reap(this.bulwark);
            this.player1.play(this.virtuousWorks);
            this.player1.play(this.shatterStorm);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a mars artifact after reap', function () {
            this.player1.reap(this.marsAmbassador);
            this.player1.reap(this.bulwark);
            this.player1.play(this.mothergun);
            expect(this.mothergun.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a mars artifact after reap', function () {
            this.player1.reap(this.marsAmbassador);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.useAction(this.invasionPortal);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a mars creature after reap', function () {
            this.player1.reap(this.bulwark);
            this.player1.reap(this.marsAmbassador);
            this.player1.play(this.barristerJoya);
            this.player1.play(this.collectorWorm);
            expect(this.collectorWorm.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a mars creature after reap', function () {
            this.player1.reap(this.marsAmbassador);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.reap(this.glyxlProliferator);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a mars action after fight', function () {
            this.player1.amber = 2;
            this.player2.amber = 4;
            this.player1.fightWith(this.marsAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.play(this.virtuousWorks);
            this.player1.play(this.shatterStorm);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a mars upgrade after fight', function () {
            this.player1.fightWith(this.marsAmbassador, this.lamindra);
            this.player1.playUpgrade(this.brainStemAntenna, this.bulwark);
            expect(this.brainStemAntenna.parent).toBe(this.bulwark);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a mars artifact after fight', function () {
            this.player1.fightWith(this.marsAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.play(this.mothergun);
            expect(this.mothergun.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a mars artifact after fight', function () {
            this.player1.fightWith(this.marsAmbassador, this.lamindra);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.useAction(this.invasionPortal);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a mars creature after fight', function () {
            this.player1.reap(this.bulwark);
            this.player1.fightWith(this.marsAmbassador, this.lamindra);
            this.player1.play(this.barristerJoya);
            this.player1.play(this.collectorWorm);
            expect(this.collectorWorm.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a mars creature after fight', function () {
            this.player1.fightWith(this.marsAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.reap(this.glyxlProliferator);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow play or use after first mars play', function () {
            this.player1.amber = 1;
            this.player2.amber = 2;
            this.player1.reap(this.marsAmbassador);
            this.player1.play(this.shatterStorm);
            this.player1.clickCard(this.collectorWorm);
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickCard(this.glyxlProliferator);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow play or use after first mars use', function () {
            this.player1.fightWith(this.marsAmbassador, this.lamindra);
            this.player1.fightWith(this.glyxlProliferator, this.lamindra);
            this.player1.clickCard(this.collectorWorm);
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickCard(this.invasionPortal);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
