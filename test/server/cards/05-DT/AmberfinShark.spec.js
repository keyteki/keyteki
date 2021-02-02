describe('Amberfin Shark', function () {
    describe("Amberfin Shark's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    hand: ['æmberfin-shark']
                },
                player2: {
                    amber: 1,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.æmberfinShark);
            });

            it('should add 3 power tokens to it', function () {
                expect(this.æmberfinShark.tokens.power).toBe(3);
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(1);
            });

            describe("at the end of controller's turn", function () {
                beforeEach(function () {
                    this.player1.endTurn();
                });

                it('should remove 1 power token and give 1A to each player', function () {
                    expect(this.æmberfinShark.tokens.power).toBe(2);
                    expect(this.player1.amber).toBe(3);
                    expect(this.player2.amber).toBe(2);
                });

                describe("at the end of opponent's turn", function () {
                    beforeEach(function () {
                        this.player2.clickPrompt('shadows');
                        this.player2.endTurn();
                    });

                    it('should not remove 1 power token and give 1A to each player', function () {
                        expect(this.æmberfinShark.tokens.power).toBe(2);
                        expect(this.player1.amber).toBe(3);
                        expect(this.player2.amber).toBe(2);
                    });

                    describe("at the end of onwer's turn and no power token", function () {
                        beforeEach(function () {
                            this.player1.clickPrompt('untamed');
                            this.æmberfinShark.tokens.power = 0;
                            this.player1.endTurn();
                        });

                        it('should not remove 1 power token and give 1A to each player', function () {
                            expect(this.æmberfinShark.tokens.power).toBe(0);
                            expect(this.player1.amber).toBe(3);
                            expect(this.player2.amber).toBe(2);
                        });
                    });
                });
            });
        });
    });
});
