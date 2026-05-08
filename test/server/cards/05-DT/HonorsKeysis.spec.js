describe('Honors Keysis', function () {
    describe("Honors Keysis's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['honors-keysis', 'dextre', 'data-forge', 'animator', 'backup-copy']
                },
                player2: {
                    amber: 4,
                    inPlay: ['zorg', 'lamindra']
                }
            });
        });

        describe('when it is the first card played', function () {
            beforeEach(function () {
                this.player1.player.amber = 12;
                this.player1.play(this.honorsKeysis);
            });

            it('should forge paying 6 +7 -1A', function () {
                this.player1.forgeKey('Red');
                expect(this.player1.amber).toBe(1); // ambers gained by itself
                expect(this.honorsKeysis.location).toBe('purged');
            });
        });

        describe('when cards are played before it', function () {
            beforeEach(function () {
                this.player1.player.amber = 8;
                this.player1.play(this.dextre);
                this.player1.play(this.animator);
                this.player1.play(this.dataForge);
                this.player1.playUpgrade(this.backupCopy, this.dextre);
                this.player1.play(this.honorsKeysis);
            });

            it('should forge paying  6 +7 -5A', function () {
                this.player1.forgeKey('Red');
                expect(this.player1.amber).toBe(3); // ambers gained by itself and other cards
                expect(this.honorsKeysis.location).toBe('purged');
            });
        });
    });
});
