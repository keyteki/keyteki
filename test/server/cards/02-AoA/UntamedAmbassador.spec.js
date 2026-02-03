describe('Untamed Ambassador', function () {
    describe("Untamed Ambassador's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: [
                        'knoxx',
                        'full-moon',
                        'nepenthe-seed',
                        'virtuous-works',
                        'barrister-joya'
                    ],
                    inPlay: [
                        'untamed-ambassador',
                        'bulwark',
                        'challe-the-safeguard',
                        'grovekeeper',
                        'niffle-grounds'
                    ],
                    discard: ['dust-pixie']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'urchin', 'redlock']
                }
            });
        });

        it('should let play an untamed action after reap', function () {
            this.player1.reap(this.untamedAmbassador);
            this.player1.reap(this.bulwark);
            this.player1.play(this.virtuousWorks);
            this.player1.play(this.fullMoon);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play an untamed artifact after reap', function () {
            this.player1.reap(this.untamedAmbassador);
            this.player1.reap(this.bulwark);
            this.player1.play(this.nepentheSeed);
            expect(this.nepentheSeed.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use an untamed artifact after reap', function () {
            this.player1.reap(this.untamedAmbassador);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.useAction(this.niffleGrounds);
            this.player1.clickCard(this.lamindra);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play an untamed creature after reap', function () {
            this.player1.reap(this.bulwark);
            this.player1.reap(this.untamedAmbassador);
            this.player1.play(this.barristerJoya);
            this.player1.play(this.knoxx);
            expect(this.knoxx.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use an untamed creature after reap', function () {
            this.player1.reap(this.untamedAmbassador);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.reap(this.grovekeeper);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play an untamed action after fight', function () {
            this.player1.fightWith(this.untamedAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.play(this.virtuousWorks);
            this.player1.play(this.fullMoon);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play an untamed artifact after fight', function () {
            this.player1.fightWith(this.untamedAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.play(this.nepentheSeed);
            expect(this.nepentheSeed.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use an untamed artifact after fight', function () {
            this.player1.fightWith(this.untamedAmbassador, this.lamindra);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.useAction(this.niffleGrounds);
            this.player1.clickCard(this.urchin);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play an untamed creature after fight', function () {
            this.player1.reap(this.bulwark);
            this.player1.fightWith(this.untamedAmbassador, this.lamindra);
            this.player1.play(this.barristerJoya);
            this.player1.play(this.knoxx);
            expect(this.knoxx.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use an untamed creature after fight', function () {
            this.player1.fightWith(this.untamedAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.reap(this.grovekeeper);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow play or use after first untamed play', function () {
            this.player1.reap(this.untamedAmbassador);
            this.player1.play(this.fullMoon);
            this.player1.clickCard(this.knoxx);
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickCard(this.grovekeeper);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow play or use after first untamed use', function () {
            this.player1.fightWith(this.untamedAmbassador, this.lamindra);
            this.player1.fightWith(this.grovekeeper, this.lamindra);
            this.player1.clickCard(this.knoxx);
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickCard(this.niffleGrounds);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
