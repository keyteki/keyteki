describe('Talmage Steelheart Evil Twin', function () {
    describe("Talmage Steelheart Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: [
                        'talmage-steelheart-evil-twin',
                        'dextre',
                        'data-forge',
                        'animator',
                        'backup-copy'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['zorg', 'lamindra']
                }
            });
        });

        describe('when it is the first card played', function () {
            beforeEach(function () {
                this.player1.play(this.talmageSteelheartEvilTwin);
            });

            it('should deal 1D to an enemy creature counter', function () {
                expect(this.player1).toBeAbleToSelect(this.zorg);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).not.toBeAbleToSelect(this.talmageSteelheartEvilTwin);
                this.player1.clickCard(this.zorg);
                expect(this.zorg.damage).toBe(1);
            });
        });

        describe('when cards are played before it', function () {
            beforeEach(function () {
                this.player1.play(this.dextre);
                this.player1.play(this.animator);
                this.player1.play(this.dataForge);
                this.player1.playUpgrade(this.backupCopy, this.dextre);
                this.player1.play(this.talmageSteelheartEvilTwin);
            });

            it('should deal as much damage to an enemy creature', function () {
                expect(this.player1).toBeAbleToSelect(this.zorg);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).not.toBeAbleToSelect(this.dextre);
                expect(this.player1).not.toBeAbleToSelect(this.talmageSteelheartEvilTwin);
                this.player1.clickCard(this.zorg);
                expect(this.zorg.damage).toBe(5);
            });
        });
    });
});
