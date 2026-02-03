describe('Shadows Ambassador', function () {
    describe("Shadows Ambassador's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: [
                        'bad-penny',
                        'nerve-blast',
                        'skeleton-key',
                        'virtuous-works',
                        'barrister-joya',
                        'duskrunner'
                    ],
                    inPlay: [
                        'shadows-ambassador',
                        'bulwark',
                        'challe-the-safeguard',
                        'umbra',
                        'subtle-maul'
                    ]
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'urchin', 'redlock']
                }
            });
        });

        it('should let play a shadows upgrade after reap', function () {
            this.player1.reap(this.shadowsAmbassador);
            this.player1.playUpgrade(this.duskrunner, this.bulwark);
            expect(this.duskrunner.parent).toBe(this.bulwark);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a shadows action after reap', function () {
            this.player1.reap(this.shadowsAmbassador);
            this.player1.reap(this.bulwark);
            this.player1.play(this.virtuousWorks);
            this.player1.play(this.nerveBlast);
            this.player1.clickCard(this.lamindra);
            expect(this.player1.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a shadows artifact after reap', function () {
            this.player1.reap(this.shadowsAmbassador);
            this.player1.reap(this.bulwark);
            this.player1.play(this.skeletonKey);
            expect(this.skeletonKey.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a shadows artifact after reap', function () {
            this.player1.reap(this.shadowsAmbassador);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.useAction(this.subtleMaul);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a shadows creature after reap', function () {
            this.player1.reap(this.bulwark);
            this.player1.reap(this.shadowsAmbassador);
            this.player1.play(this.barristerJoya);
            this.player1.play(this.badPenny);
            expect(this.badPenny.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a shadows creature after reap', function () {
            this.player1.reap(this.shadowsAmbassador);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.fightWith(this.umbra, this.lamindra);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a shadows action after fight', function () {
            this.player1.fightWith(this.shadowsAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.play(this.virtuousWorks);
            this.player1.play(this.nerveBlast);
            this.player1.clickCard(this.urchin);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a shadows upgrade after fight', function () {
            this.player1.fightWith(this.shadowsAmbassador, this.lamindra);
            this.player1.playUpgrade(this.duskrunner, this.bulwark);
            expect(this.duskrunner.parent).toBe(this.bulwark);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a shadows artifact after fight', function () {
            this.player1.fightWith(this.shadowsAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.play(this.skeletonKey);
            expect(this.skeletonKey.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a shadows artifact after fight', function () {
            this.player1.fightWith(this.shadowsAmbassador, this.lamindra);
            this.player1.fightWith(this.bulwark, this.redlock);
            this.player1.useAction(this.subtleMaul);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let play a shadows creature after fight', function () {
            this.player1.reap(this.bulwark);
            this.player1.fightWith(this.shadowsAmbassador, this.lamindra);
            this.player1.play(this.barristerJoya);
            this.player1.play(this.badPenny);
            expect(this.badPenny.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should let use a shadows creature after fight', function () {
            this.player1.fightWith(this.shadowsAmbassador, this.lamindra);
            this.player1.reap(this.bulwark);
            this.player1.fightWith(this.umbra, this.urchin);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow play or use after first shadows play', function () {
            this.player1.reap(this.shadowsAmbassador);
            this.player1.play(this.nerveBlast);
            this.player1.clickCard(this.lamindra);
            this.player1.clickCard(this.badPenny);
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickCard(this.umbra);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not allow play or use after first shadows use', function () {
            this.player1.fightWith(this.shadowsAmbassador, this.lamindra);
            this.player1.fightWith(this.umbra, this.lamindra);
            this.player1.clickCard(this.badPenny);
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickCard(this.subtleMaul);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
