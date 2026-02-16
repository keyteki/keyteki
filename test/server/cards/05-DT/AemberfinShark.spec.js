describe('Æmberfin Shark', function () {
    describe("Æmberfin Shark's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['æmberfin-shark']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        describe('after play', function () {
            beforeEach(function () {
                this.player1.play(this.æmberfinShark);
            });

            it('should have 3 power counters', function () {
                expect(this.æmberfinShark.powerCounters).toBe(3);
            });

            describe('at the end of player 1 turn', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                });

                it('should have 2 power counters and make each player gain 1 amber', function () {
                    expect(this.æmberfinShark.powerCounters).toBe(2);
                    expect(this.player1.amber).toBe(2);
                    expect(this.player2.amber).toBe(3);
                });

                describe('at the end of player 2 turn', function () {
                    beforeEach(function () {
                        this.player2.clickPrompt('shadows');
                        this.player2.endTurn();
                    });

                    it('should continue with 2 power counters and players do not gain amber', function () {
                        expect(this.æmberfinShark.powerCounters).toBe(2);
                        expect(this.player1.amber).toBe(2);
                        expect(this.player2.amber).toBe(3);
                    });

                    describe('after 2 extra rounds', function () {
                        beforeEach(function () {
                            this.player1.clickPrompt('untamed');
                            this.player1.endTurn();
                            this.player2.clickPrompt('shadows');
                            this.player2.endTurn();
                            this.player1.clickPrompt('untamed');
                            this.player1.endTurn();
                        });

                        it('should have no power counters and players gained 2 ambers each', function () {
                            expect(this.æmberfinShark.powerCounters).toBe(0);
                            expect(this.player1.amber).toBe(4);
                            expect(this.player2.amber).toBe(5);
                        });

                        describe('from next round on', function () {
                            beforeEach(function () {
                                this.player2.clickPrompt('shadows');
                                this.player2.endTurn();
                                this.player1.clickPrompt('untamed');
                                this.player1.endTurn();
                                this.player2.clickPrompt('shadows');
                                this.player2.endTurn();
                                this.player1.clickPrompt('untamed');
                                this.player1.endTurn();
                            });

                            it('should have no power counters and players will not gain amber', function () {
                                expect(this.æmberfinShark.powerCounters).toBe(0);
                                expect(this.player1.amber).toBe(4);
                                expect(this.player2.amber).toBe(5);
                            });
                        });
                    });
                });
            });
        });
    });
});
