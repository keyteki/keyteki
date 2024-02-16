describe('Curse Of Disappearances', function () {
    describe("Curse Of Disappearance's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['curse-of-disappearances'],
                    inPlay: ['brammo']
                },
                player2: {
                    inPlay: ['john-smyth', 'mindwarper']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.curseOfDisappearances);
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
            });

            it('should enter play under opponents control', function () {
                expect(this.curseOfDisappearances.location).toBe('play area');
                expect(this.player1.player.cardsInPlay).not.toContain(this.curseOfDisappearances);
                expect(this.player2.player.cardsInPlay).toContain(this.curseOfDisappearances);
            });

            describe("at the end of opponent's turn", function () {
                beforeEach(function () {
                    expect(this.johnSmyth.location).toBe('play area');
                    this.player2.endTurn();
                    expect(this.player2).toBeAbleToSelect(this.johnSmyth);
                    expect(this.player2).toBeAbleToSelect(this.mindwarper);
                    expect(this.player2).not.toBeAbleToSelect(this.brammo);
                    expect(this.player2.currentButtons).not.toContain('Done');
                    this.player2.clickCard(this.johnSmyth);
                });

                it("should archive one of opponent's creature", function () {
                    expect(this.johnSmyth.location).toBe('archives');
                    expect(this.player1.player.archives).toContain(this.johnSmyth);
                    expect(this.mindwarper.location).toBe('play area');
                });

                describe('at the end of self turn', function () {
                    it('should not archive friendly creature', function () {
                        this.player1.clickPrompt('mars');
                        this.player1.clickPrompt('No');
                        this.player1.endTurn();
                        expect(this.brammo.location).toBe('play area');
                    });
                });
            });
        });
    });
});
