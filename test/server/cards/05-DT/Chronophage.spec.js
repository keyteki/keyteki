describe('Chronophage', function () {
    describe("Chronophage's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    inPlay: ['chronophage'],
                    hand: ['dextre', 'archimedes', 'data-forge', 'animator', 'backup-copy']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens'],
                    hand: [
                        'too-much-to-protect',
                        'evasion-sigil',
                        'inky-gloom',
                        'lamindra',
                        'mole',
                        'mighty-tiger',
                        'bubbles'
                    ]
                }
            });
        });

        it('own creatures should not be affected', function () {
            this.player1.play(this.dextre);
            this.player1.play(this.archimedes);
        });

        it('own artifacts should not be affected', function () {
            this.player1.play(this.animator);
            this.player1.play(this.archimedes);
        });

        it('own actions should not be affected', function () {
            this.player1.play(this.dataForge);
            this.player1.play(this.archimedes);
        });

        it('own ugrades should not be affected', function () {
            this.player1.play(this.dextre);
            this.player1.playUpgrade(this.backupCopy, this.dextre);
            this.player1.play(this.archimedes);
        });

        describe("during opponent's turn", function () {
            beforeEach(function () {
                this.player1.endTurn();
            });

            it('enemy creatures should be affected', function () {
                this.player2.clickPrompt('shadows');
                this.player2.play(this.lamindra);
                this.player1.clickPrompt('logos');
            });

            it('enemy creatures should be affected even if destroying chronophage', function () {
                this.player2.clickPrompt('untamed');
                this.player2.play(this.mightyTiger);
                this.player2.clickCard(this.chronophage);
                expect(this.chronophage.location).toBe('discard');
                this.player1.clickPrompt('logos');
            });

            it('enemy creatures should be affected even if removing chronophage from play', function () {
                this.player2.clickPrompt('unfathomable');
                this.player2.play(this.bubbles);
                this.player2.clickCard(this.chronophage);
                expect(this.chronophage.location).toBe('deck');
                this.player1.clickPrompt('logos');
            });

            it('enemy artifacts should not be affected', function () {
                this.player2.clickPrompt('shadows');
                this.player2.play(this.evasionSigil);
                this.player1.clickPrompt('logos');
            });

            it('enemy actions should not be affected', function () {
                this.player2.clickPrompt('shadows');
                this.player2.play(this.tooMuchToProtect);
                this.player2.play(this.inkyGloom);
            });

            it('enemy ugrades should not be affected', function () {
                this.player2.clickPrompt('shadows');
                this.player2.playUpgrade(this.mole, this.murkens);
                this.player2.play(this.inkyGloom);
            });
        });
    });
});
