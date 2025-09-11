describe('Curse Of Fertility', function () {
    describe("Curse Of Fertility's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['curse-of-fertility']
                },
                player2: {
                    amber: 1,
                    hand: ['john-smyth']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.curseOfFertility);
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
            });

            it('should enter play under opponents control', function () {
                expect(this.curseOfFertility.location).toBe('play area');
                expect(this.player1.player.cardsInPlay).not.toContain(this.curseOfFertility);
                expect(this.player2.player.cardsInPlay).toContain(this.curseOfFertility);
            });

            describe("at the end of owner's turn", function () {
                it('should gain opponent amber if no creature played', function () {
                    this.player2.endTurn();
                    expect(this.player1.amber).toBe(2);
                    expect(this.player2.amber).toBe(1);
                });

                it('should not gain opponent amber if a creature played', function () {
                    this.player2.playCreature(this.johnSmyth);
                    this.player2.endTurn();
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(1);
                });
            });
        });
    });
});
