describe('Curse Of Spontaneity', function () {
    describe("Curse Of Spontaneity's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['curse-of-spontaneity', 'flaxia']
                },
                player2: {
                    amber: 1,
                    hand: ['john-smyth', 'crystal-hive']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.curseOfSpontaneity);
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
            });

            it('should enter play under opponents control', function () {
                expect(this.curseOfSpontaneity.location).toBe('play area');
                expect(this.player1.player.cardsInPlay).not.toContain(this.curseOfSpontaneity);
                expect(this.player2.player.cardsInPlay).toContain(this.curseOfSpontaneity);
            });

            describe("at the end of controller's turn", function () {
                it('should discard their hand', function () {
                    this.player2.endTurn();
                    this.player2.clickPrompt('Autoresolve');
                    expect(this.johnSmyth.location).toBe('discard');
                    expect(this.crystalHive.location).toBe('discard');
                    expect(this.player2.player.hand.length).toBe(6);
                    expect(this.flaxia.location).toBe('hand');
                    expect(this.player1.player.hand.length).toBe(6);
                    this.player1.clickPrompt('ekwidon');
                    expect(this.player1).isReadyToTakeAction();
                });
            });
        });
    });
});
