describe('Dis Ambassador', function () {
    describe("Dis Ambassador's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: [
                        'charette',
                        'binding-irons',
                        'orb-of-invidius',
                        'virtuous-works',
                        'barrister-joya',
                        'collar-of-subordination'
                    ],
                    inPlay: [
                        'dis-ambassador',
                        'bulwark',
                        'challe-the-safeguard',
                        'shooler',
                        'lash-of-broken-dreams'
                    ]
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'urchin', 'redlock']
                }
            });
        });

        it('should let play a dis upgrade after reap', function () {
            this.player1.reap(this.disAmbassador);
            this.player1.playUpgrade(this.collarOfSubordination, this.bulwark);
            expect(this.collarOfSubordination.parent).toBe(this.bulwark);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a dis action after reap', function () {
            this.player1.reap(this.disAmbassador);
            this.player1.reap(this.bulwark);
            this.player1.play(this.virtuousWorks);
            this.player1.play(this.bindingIrons);
            expect(this.player2.chains).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a dis artifact after reap', function () {
            this.player1.reap(this.disAmbassador);
            this.player1.reap(this.bulwark);
            this.player1.play(this.orbOfInvidius);
            expect(this.orbOfInvidius.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a dis artifact after reap', function () {
            this.player1.reap(this.disAmbassador);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.useAction(this.lashOfBrokenDreams);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a dis creature after reap', function () {
            this.player1.reap(this.bulwark);
            this.player1.reap(this.disAmbassador);
            this.player1.play(this.barristerJoya);
            this.player1.play(this.charette);
            expect(this.charette.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a dis creature after reap', function () {
            this.player1.reap(this.disAmbassador);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.reap(this.shooler);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a dis action after fight', function () {
            this.player1.fightWith(this.disAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.play(this.virtuousWorks);
            this.player1.play(this.bindingIrons);
            expect(this.player2.chains).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a dis upgrade after fight', function () {
            this.player1.fightWith(this.disAmbassador, this.lamindra);
            this.player1.playUpgrade(this.collarOfSubordination, this.bulwark);
            expect(this.collarOfSubordination.parent).toBe(this.bulwark);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a dis artifact after fight', function () {
            this.player1.fightWith(this.disAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.play(this.orbOfInvidius);
            expect(this.orbOfInvidius.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a dis artifact after fight', function () {
            this.player1.fightWith(this.disAmbassador, this.lamindra);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.useAction(this.lashOfBrokenDreams);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a dis creature after fight', function () {
            this.player1.reap(this.bulwark);
            this.player1.fightWith(this.disAmbassador, this.lamindra);
            this.player1.play(this.barristerJoya);
            this.player1.play(this.charette);
            expect(this.charette.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a dis creature after fight', function () {
            this.player1.fightWith(this.disAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.reap(this.shooler);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow play or use after first dis play', function () {
            this.player1.reap(this.disAmbassador);
            this.player1.play(this.bindingIrons);
            this.player1.clickCard(this.charette);
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickCard(this.shooler);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow play or use after first dis use', function () {
            this.player1.fightWith(this.disAmbassador, this.lamindra);
            this.player1.fightWith(this.shooler, this.lamindra);
            this.player1.clickCard(this.charette);
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickCard(this.lashOfBrokenDreams);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
