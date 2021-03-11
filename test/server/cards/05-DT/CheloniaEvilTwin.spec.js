describe('Chelonia Evil Twin', function () {
    describe("Chelonia Evil Twin's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['chelonia-evil-twin', 'roxador', 'ancient-bear']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when the tide is not high', function () {
            describe('and Chelonia is played', function () {
                beforeEach(function () {
                    this.player1.play(this.cheloniaEvilTwin);
                });

                it('should not make opponent lose amber', function () {
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(4);
                });

                describe('when playing other creatures', function () {
                    beforeEach(function () {
                        this.player1.play(this.ancientBear);
                        this.player1.play(this.roxador);
                    });

                    it('should not make opponent lose amber', function () {
                        expect(this.player1.amber).toBe(1);
                        expect(this.player2.amber).toBe(4);
                    });
                });
            });
        });

        describe('when the tide is high', function () {
            describe('and Chelonia is played', function () {
                beforeEach(function () {
                    this.player1.raiseTide();
                    this.player1.play(this.cheloniaEvilTwin);
                });

                it('should not make opponent lose amber', function () {
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(4);
                });

                describe('when playing other creatures', function () {
                    beforeEach(function () {
                        this.player1.play(this.ancientBear);
                        this.player1.play(this.roxador);
                    });

                    it('should make opponent lose amber', function () {
                        expect(this.player1.amber).toBe(1);
                        expect(this.player2.amber).toBe(2);
                    });
                });
            });
        });
    });
});
