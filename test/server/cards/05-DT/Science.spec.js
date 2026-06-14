describe('Science!', function () {
    describe("Science!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: [
                        'dextre',
                        'opposition-research',
                        'science',
                        'data-forge',
                        'animator',
                        'backup-copy',
                        'wild-wormhole'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should not gain amber if playing action before science', function () {
            this.player1.play(this.dataForge);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 1 amber for each action played after science', function () {
            this.player1.play(this.science);
            this.player1.play(this.oppositionResearch);
            this.player1.clickPrompt('Science!');
            this.player1.play(this.dataForge);
            this.player1.clickPrompt('Science!');
            expect(this.player1.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain amber if playing creature/upgrade after science', function () {
            this.player1.play(this.science);
            this.player1.play(this.dextre);
            this.player1.playUpgrade(this.backupCopy, this.dextre);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain amber if playing artifact after science', function () {
            this.player1.play(this.science);
            this.player1.play(this.animator);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain amber for already resolving action', function () {
            this.player1.moveCard(this.science, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
