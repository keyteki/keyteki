describe('Talmage Steelheart', function () {
    describe("Talmage Steelheart's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['talmage-steelheart', 'dextre', 'data-forge', 'animator', 'backup-copy']
                },
                player2: {
                    amber: 4,
                    inPlay: ['zorg', 'lamindra']
                }
            });
        });

        describe('when it is the first card played', function () {
            beforeEach(function () {
                this.player1.play(this.talmageSteelheart);
            });

            it('should gain +1 power counter', function () {
                expect(this.talmageSteelheart.powerCounters).toBe(1);
            });
        });

        describe('when cards are played before it', function () {
            beforeEach(function () {
                this.player1.play(this.dextre);
                this.player1.play(this.animator);
                this.player1.play(this.dataForge);
                this.player1.playUpgrade(this.backupCopy, this.dextre);
                this.player1.play(this.talmageSteelheart);
            });

            it('should gain as much power counters', function () {
                expect(this.talmageSteelheart.powerCounters).toBe(5);
            });
        });
    });
});
