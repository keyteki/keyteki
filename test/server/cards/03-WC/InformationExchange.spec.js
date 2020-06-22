describe('Information Exchange', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    hand: ['information-exchange']
                },
                player2: {
                    amber: 3,
                    hand: ['urchin']
                }
            });
        });

        describe('and nothing has been stolen by the opponent in the previous turn', function () {
            beforeEach(function () {
                this.player1.play(this.informationExchange);
            });

            it('should steal 1 amber', function () {
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(2);
            });
        });

        describe('and amber has been stolen by the opponent in the previous turn', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player1.amber = 4;
                this.player2.amber = 4;

                this.player2.clickPrompt('shadows');
                this.player2.play(this.urchin);
                this.player2.endTurn();

                this.player1.clickPrompt('logos');
                this.player1.play(this.informationExchange);
            });

            it('should steal 2 amber', function () {
                expect(this.player1.amber).toBe(5);
                expect(this.player2.amber).toBe(3);
            });

            describe('and no amber is stolen in the following turn', function () {
                beforeEach(function () {
                    this.player1.moveCard(this.informationExchange, 'hand');
                    this.player1.endTurn();
                    this.player1.amber = 3;
                    this.player2.amber = 3;

                    this.player2.clickPrompt('shadows');
                    this.player2.endTurn();

                    this.player1.clickPrompt('logos');
                    this.player1.play(this.informationExchange);
                });

                it('should steal 1 amber', function () {
                    expect(this.player1.amber).toBe(4);
                    expect(this.player2.amber).toBe(2);
                });
            });
        });
    });

    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    hand: ['information-exchange']
                },
                player2: {
                    amber: 3,
                    hand: ['urchin', 'sci-officer-qincan']
                }
            });
        });

        it('should only steal 2 if the amber was stolen from the player on the OPPONENTS TURN [Qincan]', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.play(this.sciOfficerQincan);
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            expect(this.player2.amber).toBe(4);
            expect(this.player1.amber).toBe(1);
            this.player1.play(this.informationExchange);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });
    });
});
