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
                expect(this.senatorBracchus.amber).toBe(1);
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
                expect(this.grimlocusDux.amber).toBe(2);
                expect(this.senatorBracchus.amber).toBe(1);
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
                expect(this.grimlocusDux.amber).toBe(1);
                expect(this.senatorBracchus.amber).toBe(0);
                expect(this.senatorShrix.amber).toBe(0);
                this.player1.clickPrompt('Red');
                expect(this.player1.amber).toBe(2);
            });
        });

        describe('with an enemy creature', function () {
            beforeEach(function () {
                this.lamindra.amber = 8;
                this.player1.endTurn();
            });

            it('should not allow opponent to spend amber from their creature', function () {
                expect(this.player2).not.toHavePrompt(
                    'How much amber do you want to use from Lamindra?'
                );
                this.player2.clickPrompt('shadows');
                expect(this.lamindra.amber).toBe(8);
            });
        });
    });

    describe('when on the board', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['lamindra']
                },
                player2: {
                    amber: 2,
                    inPlay: ['senator-bracchus', 'senator-shrix', 'champion-anaphiel']
                }
            });
        });

        it('should always use amber on creatures', function () {
            this.senatorBracchus.amber = 4;
            this.senatorShrix.amber = 2;
            this.championAnaphiel.amber = 2;
            this.player1.endTurn();

            expect(this.player2).toHavePrompt(
                'How much amber do you want to use from Senator Bracchus?'
            );
            expect(this.player2).toHavePromptButton(0);
            expect(this.player2).toHavePromptButton(1);
            expect(this.player2).toHavePromptButton(2);
            expect(this.player2).toHavePromptButton(3);
            expect(this.player2).toHavePromptButton(4);
            this.player2.clickPrompt(0);
            expect(this.player2).toHavePrompt('Which key would you like to forge?');
            this.player2.clickPrompt('red');
        });
    });
});
