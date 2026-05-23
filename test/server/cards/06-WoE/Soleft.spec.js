describe('Soleft', function () {
    describe("Soleft's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 4,
                    hand: ['draining-touch'],
                    inPlay: ['seabringer-kekoa', 'nexus', 'soleft']
                },
                player2: {
                    amber: 2,
                    token: 'trader',
                    inPlay: ['trader:batdrone', 'mother', 'helper-bot']
                }
            });
        });

        it('should destroy the left creature', function () {
            this.player1.play(this.drainingTouch);
            this.player1.clickCard(this.soleft);
            expect(this.seabringerKekoa.location).toBe('play area');
            expect(this.nexus.location).toBe('play area');
            expect(this.trader.location).toBe('discard');
            expect(this.mother.location).toBe('play area');
            expect(this.helperBot.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Soleft's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 4,
                    hand: ['draining-touch'],
                    inPlay: ['seabringer-kekoa', 'nexus', 'soleft']
                },
                player2: {
                    amber: 6,
                    inPlay: []
                }
            });
        });

        it('should do nothing with no opponent creatures', function () {
            this.player1.play(this.drainingTouch);
            this.player1.clickCard(this.soleft);
            expect(this.seabringerKekoa.location).toBe('play area');
            expect(this.nexus.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("when opponent's left flank is tagged for destruction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['soleft']
                },
                player2: {
                    inPlay: ['brillix-ponder', 'mother', 'helper-bot']
                }
            });
        });

        it('should target the tagged-for-destruction left-flank creature', function () {
            this.soleft.ready();
            this.player1.fightWith(this.soleft, this.brillixPonder);
            expect(this.soleft.location).toBe('discard');
            expect(this.brillixPonder.location).toBe('discard');
            expect(this.mother.location).toBe('play area');
            expect(this.helperBot.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when two Solefts are destroyed simultaneously', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['ammonia-clouds'],
                    inPlay: ['soleft', 'soleft']
                },
                player2: {
                    inPlay: ['brillix-ponder', 'mother', 'bumpsy']
                }
            });
        });

        it('both Solefts should target the same (tagged-for-destruction) left-flank creature', function () {
            this.player1.play(this.ammoniaClouds);
            // Both Solefts trigger destroyed simultaneously; resolve in order.
            const soleftCopies = this.player1.player.cardsInPlay.filter((c) => c.id === 'soleft');
            this.player1.clickCard(soleftCopies[0]);
            if (this.player1.hasPrompt('Triggered Abilities')) {
                this.player1.clickCard(soleftCopies[1]);
            }
            const solefts = this.player1.player.discard.filter((c) => c.id === 'soleft');
            expect(solefts.length).toBe(2);
            expect(this.brillixPonder.location).toBe('discard');
            expect(this.mother.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
