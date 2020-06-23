describe('Senator Shrix', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'saurian',
                    hand: ['senator-shrix']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll']
                }
            });

            this.player1.play(this.senatorShrix);
        });

        it('should allow shrix to be exalted', function () {
            expect(this.player1).toHavePrompt('Any reactions to Senator Shrix being played?');
        });

        describe('and the ability is triggered', function () {
            beforeEach(function () {
                this.player1.clickCard(this.senatorShrix);
            });

            it('should exalt shrix', function () {
                expect(this.senatorShrix.tokens.amber).toBe(1);
            });

            describe('and then shrix reaps', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player1.amber = 4;

                    this.player2.clickPrompt('brobnar');
                    this.player2.endTurn();

                    this.player1.clickPrompt('saurian');
                    this.player1.reap(this.senatorShrix);
                });

                describe('and the ability is triggered', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.senatorShrix);
                    });

                    it('should exalt shrix', function () {
                        expect(this.senatorShrix.tokens.amber).toBe(2);
                    });
                });

                describe('and the ability is not triggered', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('Done');
                    });

                    it('should not exalt shrix', function () {
                        expect(this.senatorShrix.tokens.amber).toBe(1);
                    });
                });
            });

            describe('and the next turn begins', function () {
                beforeEach(function () {
                    this.player1.endTurn();

                    this.player2.clickPrompt('brobnar');
                    this.player2.endTurn();
                });

                it('should prompt the forge key prompt', function () {
                    expect(this.player1).toHavePrompt('Which key would you like to forge?');
                });
            });
        });

        describe('and the ability is not triggered', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Done');
            });

            it('should not exalt shrix', function () {
                expect(this.senatorShrix.tokens.amber).toBe(undefined);
            });
        });
    });
});
