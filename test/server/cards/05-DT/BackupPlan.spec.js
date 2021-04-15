describe('Backup Plan', function () {
    describe("Backup Plan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['backup-plan', 'dextre', 'archimedes', 'hapsis'],
                    discard: ['troll', 'groggins', 'alaka']
                },
                player2: {
                    amber: 4,
                    inPlay: ['zorg', 'lamindra']
                }
            });

            this.player1.moveCard(this.alaka, 'deck');
            this.player1.moveCard(this.troll, 'deck');
            this.player1.moveCard(this.groggins, 'deck');
        });

        describe('when creature count is the same', function () {
            beforeEach(function () {
                this.player1.play(this.dextre);
                this.player1.play(this.archimedes);
                this.player1.play(this.backupPlan);
            });

            it('should not archive any card', function () {
                expect(this.player1.player.archives.length).toBe(0);
            });
        });

        describe('when own creature count is greater', function () {
            beforeEach(function () {
                this.player1.play(this.dextre);
                this.player1.play(this.hapsis);
                this.player1.play(this.archimedes);
                this.player1.play(this.backupPlan);
            });

            it('should not archive any card', function () {
                expect(this.player1.player.archives.length).toBe(0);
            });
        });

        describe('when enemy creature count is greater', function () {
            beforeEach(function () {
                this.player1.play(this.dextre);
                this.player1.play(this.backupPlan);
            });

            it('should archive the difference', function () {
                expect(this.player1.player.archives.length).toBe(1);
                expect(this.groggins.location).toBe('archives');
                expect(this.troll.location).toBe('deck');
                expect(this.alaka.location).toBe('deck');
            });
        });
    });
});
