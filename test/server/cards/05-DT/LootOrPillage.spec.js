describe('Loot or Pillage', function () {
    describe("Loot or Pillage's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    hand: ['loot-or-pillage'],
                    inPlay: ['hookmaster', 'fidgit']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens', 'lamindra']
                }
            });

            this.player1.play(this.lootOrPillage);
        });

        it('should prompt to steal or capture', function () {
            expect(this.player1).toHavePromptButton('Steal 1 amber');
            expect(this.player1).toHavePromptButton('Capture 3 amber');
        });

        describe('steal is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Steal 1 amber');
            });

            it('should steal 1A', function () {
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(3);
                this.player1.endTurn();
            });
        });

        describe('capture is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Capture 3 amber');
            });

            it('should be able to select friendly creature', function () {
                expect(this.player1).toBeAbleToSelect(this.fidgit);
                expect(this.player1).toBeAbleToSelect(this.hookmaster);
                expect(this.player1).not.toBeAbleToSelect(this.murkens);
                expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            });

            describe('a friendly creature is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.hookmaster);
                });

                it('should be able to select friendly creature', function () {
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(1);
                    expect(this.hookmaster.amber).toBe(3);
                    this.player1.endTurn();
                });
            });
        });
    });
});
