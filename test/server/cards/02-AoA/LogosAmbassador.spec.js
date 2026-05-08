describe('Logos Ambassador', function () {
    describe("Logos Ambassador's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: [
                        'titan-mechanic',
                        'interdimensional-graft',
                        'library-of-babble',
                        'virtuous-works',
                        'barrister-joya',
                        'rocket-boots'
                    ],
                    inPlay: [
                        'logos-ambassador',
                        'bulwark',
                        'challe-the-safeguard',
                        'helper-bot',
                        'seismo-entangler'
                    ]
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'urchin', 'redlock']
                }
            });
        });

        it('should let play a logos upgrade after reap', function () {
            this.player1.reap(this.logosAmbassador);
            this.player1.playUpgrade(this.rocketBoots, this.bulwark);
            expect(this.rocketBoots.parent).toBe(this.bulwark);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a logos action after reap', function () {
            this.player1.reap(this.logosAmbassador);
            this.player1.reap(this.bulwark);
            this.player1.play(this.virtuousWorks);
            this.player1.play(this.interdimensionalGraft);
            expect(this.player1.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a logos artifact after reap', function () {
            this.player1.reap(this.logosAmbassador);
            this.player1.reap(this.bulwark);
            this.player1.play(this.libraryOfBabble);
            expect(this.libraryOfBabble.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a logos artifact after reap', function () {
            this.player1.reap(this.logosAmbassador);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.useAction(this.seismoEntangler);
            this.player1.clickPrompt('brobnar');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a logos creature after reap', function () {
            this.player1.reap(this.bulwark);
            this.player1.reap(this.logosAmbassador);
            this.player1.play(this.barristerJoya);
            this.player1.play(this.titanMechanic);
            expect(this.titanMechanic.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a logos creature after reap', function () {
            this.player1.reap(this.logosAmbassador);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.reap(this.helperBot);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a logos action after fight', function () {
            this.player1.fightWith(this.logosAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.play(this.virtuousWorks);
            this.player1.play(this.interdimensionalGraft);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a logos upgrade after fight', function () {
            this.player1.fightWith(this.logosAmbassador, this.lamindra);
            this.player1.playUpgrade(this.rocketBoots, this.bulwark);
            expect(this.rocketBoots.parent).toBe(this.bulwark);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a logos artifact after fight', function () {
            this.player1.fightWith(this.logosAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.play(this.libraryOfBabble);
            expect(this.libraryOfBabble.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a logos artifact after fight', function () {
            this.player1.fightWith(this.logosAmbassador, this.lamindra);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.useAction(this.seismoEntangler);
            this.player1.clickPrompt('brobnar');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a logos creature after fight', function () {
            this.player1.reap(this.bulwark);
            this.player1.fightWith(this.logosAmbassador, this.lamindra);
            this.player1.play(this.barristerJoya);
            this.player1.play(this.titanMechanic);
            expect(this.titanMechanic.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a logos creature after fight', function () {
            this.player1.fightWith(this.logosAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.reap(this.helperBot);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow play or use after first logos play', function () {
            this.player1.reap(this.logosAmbassador);
            this.player1.play(this.interdimensionalGraft);
            this.player1.clickCard(this.titanMechanic);
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickCard(this.helperBot);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow play or use after first logos use', function () {
            this.player1.fightWith(this.logosAmbassador, this.lamindra);
            this.player1.fightWith(this.helperBot, this.lamindra);
            this.player1.clickCard(this.titanMechanic);
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickCard(this.seismoEntangler);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
