describe('Brobnar Ambassador', function () {
    describe("Brobnar Ambassador's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['brammo', 'smith', 'screechbomb', 'virtuous-works', 'barrister-joya'],
                    inPlay: [
                        'brobnar-ambassador',
                        'bulwark',
                        'challe-the-safeguard',
                        'cowfyne',
                        'the-warchest'
                    ]
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'urchin', 'redlock']
                }
            });
        });

        it('should let play a brobnar action after reap', function () {
            this.player1.reap(this.brobnarAmbassador);
            this.player1.reap(this.bulwark);
            this.player1.play(this.virtuousWorks);
            this.player1.play(this.smith);
            expect(this.player1.amber).toBe(8);
        });

        it('should let play a brobnar artifact after reap', function () {
            this.player1.reap(this.brobnarAmbassador);
            this.player1.reap(this.bulwark);
            this.player1.play(this.screechbomb);
            expect(this.screechbomb.location).toBe('play area');
        });

        it('should let use a brobnar artifact after reap', function () {
            this.player1.reap(this.brobnarAmbassador);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.useAction(this.theWarchest);
            expect(this.player1.amber).toBe(2);
        });

        it('should let play a brobnar creature after reap', function () {
            this.player1.reap(this.bulwark);
            this.player1.reap(this.brobnarAmbassador);
            this.player1.play(this.barristerJoya);
            this.player1.play(this.brammo);
            expect(this.brammo.location).toBe('play area');
        });

        it('should let use a brobnar creature after reap', function () {
            this.player1.reap(this.brobnarAmbassador);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.reap(this.cowfyne);
            expect(this.player1.amber).toBe(2);
        });

        it('should let play a brobnar action after fight', function () {
            this.player1.fightWith(this.brobnarAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.play(this.smith);
            this.player1.play(this.virtuousWorks);
            expect(this.player1.amber).toBe(7);
        });

        it('should let play a brobnar artifact after fight', function () {
            this.player1.fightWith(this.brobnarAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.play(this.screechbomb);
            expect(this.screechbomb.location).toBe('play area');
        });

        it('should let use a brobnar artifact after fight', function () {
            this.player1.fightWith(this.brobnarAmbassador, this.lamindra);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.useAction(this.theWarchest);
            expect(this.player1.amber).toBe(1);
        });

        it('should let play a brobnar creature after fight', function () {
            this.player1.reap(this.bulwark);
            this.player1.fightWith(this.brobnarAmbassador, this.lamindra);
            this.player1.play(this.barristerJoya);
            this.player1.play(this.brammo);
            expect(this.brammo.location).toBe('play area');
        });

        it('should let use a brobnar creature after fight', function () {
            this.player1.fightWith(this.brobnarAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.reap(this.cowfyne);
            expect(this.player1.amber).toBe(2);
        });

        it('should not allow play or use after first brobnar play', function () {
            this.player1.reap(this.brobnarAmbassador);
            this.player1.play(this.smith);
            this.player1.clickCard(this.brammo);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.clickCard(this.cowfyne);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not allow play or use after first brobnar use', function () {
            this.player1.fightWith(this.brobnarAmbassador, this.lamindra);
            this.player1.fightWith(this.cowfyne, this.lamindra);
            this.player1.clickCard(this.brammo);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.clickCard(this.theWarchest);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
