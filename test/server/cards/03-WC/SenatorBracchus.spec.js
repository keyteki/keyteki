describe('Senator Bracchus', function () {
    describe('when on the board', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['senator-bracchus'],
                    hand: ['grimlocus-dux', 'senator-shrix']
                },
                player2: {
                    inPlay: ['the-sting', 'lamindra'],
                    hand: ['urchin']
                }
            });
        });

        describe('and bracchus reaps', function () {
            beforeEach(function () {
                this.player1.reap(this.senatorBracchus);
            });

            it('should exalt bracchus', function () {
                expect(this.senatorBracchus.tokens.amber).toBe(1);
                expect(this.player1.amber).toBe(5);
            });

            describe('and the turn comes back around', function () {
                beforeEach(function () {
                    this.player1.endTurn();

                    this.player2.clickPrompt('shadows');
                    this.player2.endTurn();
                });

                it('should prompt the forge key prompt', function () {
                    expect(this.player1).toHavePrompt('Which key would you like to forge?');
                });
            });
        });

        describe('with another creature', function () {
            beforeEach(function () {
                this.player1.play(this.grimlocusDux);
                this.player1.play(this.senatorShrix);
                this.player1.clickCard(this.senatorShrix);
                this.player1.reap(this.senatorBracchus);
                this.player1.endTurn();

                this.player2.clickPrompt('shadows');
                this.player2.endTurn();
            });

            it('should allow spending amber from all friendly creatures', function () {
                expect(this.grimlocusDux.tokens.amber).toBe(2);
                expect(this.senatorBracchus.tokens.amber).toBe(1);
                expect(this.player1).toHavePrompt(
                    'How much amber do you want to use from Senator Bracchus?'
                );
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt(
                    'How much amber do you want to use from Grimlocus Dux?'
                );
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt(
                    'How much amber do you want to use from Senator Shrix?'
                );
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Which key would you like to forge?');
                expect(this.grimlocusDux.tokens.amber).toBe(1);
                expect(this.senatorBracchus.hasToken('amber')).toBe(false);
                expect(this.senatorShrix.hasToken('amber')).toBe(false);
                this.player1.clickPrompt('Red');
                expect(this.player1.amber).toBe(2);
            });
        });

        describe('with an enemy creature', function () {
            beforeEach(function () {
                this.lamindra.tokens.amber = 8;
                this.player1.endTurn();
            });

            it('should not allow opponent to spend amber from their creature', function () {
                expect(this.player2).not.toHavePrompt(
                    'How much amber do you want to use from Lamindra?'
                );
                this.player2.clickPrompt('shadows');
                expect(this.lamindra.tokens.amber).toBe(8);
            });
        });
    });
});
