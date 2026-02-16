describe('Æmber-vac', function () {
    describe("Æmber-vac's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'staralliance',
                    inPlay: ['armsmaster-molina'],
                    hand: ['æmber-vac']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when played on own creatures', function () {
            beforeEach(function () {
                this.player1.playUpgrade(this.æmberVac, this.armsmasterMolina);
            });

            it('should raise the tide', function () {
                expect(this.player1.isTideHigh()).toBe(true);
            });

            describe('when the tide is high', function () {
                describe("at the start of opponent's turn", function () {
                    beforeEach(function () {
                        this.player1.endTurn();
                        this.player2.clickPrompt('shadows');
                    });

                    it('should not capture 2A', function () {
                        expect(this.armsmasterMolina.amber).toBe(0);
                        expect(this.player1.amber).toBe(4);
                        expect(this.player2.amber).toBe(4);
                    });

                    describe("at the start of owner's turn", function () {
                        beforeEach(function () {
                            this.player2.endTurn();
                            this.player1.clickPrompt('staralliance');
                        });

                        it('should capture 2A', function () {
                            expect(this.armsmasterMolina.amber).toBe(2);
                            expect(this.player1.amber).toBe(4);
                            expect(this.player2.amber).toBe(2);
                        });
                    });
                });
            });

            describe('when the tide is not high', function () {
                beforeEach(function () {
                    this.player1.lowerTide();
                });

                describe("at the start of opponent's turn", function () {
                    beforeEach(function () {
                        this.player1.endTurn();
                        this.player2.clickPrompt('shadows');
                    });

                    it('should not capture 2A', function () {
                        expect(this.armsmasterMolina.amber).toBe(0);
                        expect(this.player1.amber).toBe(4);
                        expect(this.player2.amber).toBe(4);
                    });

                    describe("at the start of owner's turn", function () {
                        beforeEach(function () {
                            this.player2.endTurn();
                            this.player1.clickPrompt('staralliance');
                        });

                        it('should not capture 2A', function () {
                            expect(this.armsmasterMolina.amber).toBe(0);
                            expect(this.player1.amber).toBe(4);
                            expect(this.player2.amber).toBe(4);
                        });
                    });
                });
            });
        });

        describe('when played on enemy creatures', function () {
            beforeEach(function () {
                this.player1.playUpgrade(this.æmberVac, this.murkens);
            });

            it('should raise the tide', function () {
                expect(this.player1.isTideHigh()).toBe(true);
            });

            describe('when the tide is not high', function () {
                describe("at the start of opponent's turn", function () {
                    beforeEach(function () {
                        this.player1.endTurn();
                        this.player2.clickPrompt('shadows');
                    });

                    it('should not capture 2A', function () {
                        expect(this.murkens.amber).toBe(0);
                        expect(this.player1.amber).toBe(4);
                        expect(this.player2.amber).toBe(4);
                    });

                    describe("at the start of owner's turn", function () {
                        beforeEach(function () {
                            this.player2.endTurn();
                            this.player1.clickPrompt('staralliance');
                        });

                        it('should not capture 2A', function () {
                            expect(this.murkens.amber).toBe(0);
                            expect(this.player1.amber).toBe(4);
                            expect(this.player2.amber).toBe(4);
                        });
                    });
                });
            });

            describe('when the tide is high', function () {
                beforeEach(function () {
                    this.player1.lowerTide();
                });

                describe("at the start of opponent's turn", function () {
                    beforeEach(function () {
                        this.player1.endTurn();
                        this.player2.clickPrompt('shadows');
                    });

                    it('should capture 2A', function () {
                        expect(this.murkens.amber).toBe(2);
                        expect(this.player1.amber).toBe(2);
                        expect(this.player2.amber).toBe(4);
                    });

                    describe("at the start of owner's turn", function () {
                        beforeEach(function () {
                            this.player2.endTurn();
                            this.player1.clickPrompt('staralliance');
                        });

                        it('should not capture 2A', function () {
                            expect(this.murkens.amber).toBe(2);
                            expect(this.player1.amber).toBe(2);
                            expect(this.player2.amber).toBe(4);
                        });
                    });
                });
            });
        });
    });
});
