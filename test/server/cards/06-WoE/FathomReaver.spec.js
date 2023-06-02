describe('Fathom Reaver', function () {
    describe("Fathom Reaver's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    token: 'b0-t',
                    amber: 1,
                    hand: ['fathom-reaver', 'sensor-chief-garcia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['charette'],
                    hand: ['streke', 'gub']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.fathomReaver);
                this.player1.clickPrompt('Left');
            });

            it('should make a token creature ', function () {
                expect(this.player1.inPlay[0].name).toBe('B0-T');
            });

            describe("during opponent's turn", function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('dis');
                    this.player2.play(this.gub);
                });

                describe('if player has token in play', function () {
                    it('should refill with -1 card', function () {
                        this.player2.endTurn();
                        expect(this.player2.hand.length).toBe(5);
                    });
                });

                describe('if player has no tokens in play', function () {
                    beforeEach(function () {
                        this.player2.fightWith(this.charette, this.player1.inPlay[0]);
                    });

                    it('should refill hands fully', function () {
                        this.player2.endTurn();
                        expect(this.player2.hand.length).toBe(6);
                    });
                });
            });
        });
    });
});
