describe('Senator Bracchus', function() {
    integration(function() {
        describe('when on the board', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 4,
                        house: 'saurian',
                        inPlay: ['senator-bracchus']
                    },
                    player2: {
                        inPlay: ['the-sting'],
                        hand: ['urchin']
                    }
                });
            });

            describe('and bracchus reaps', function() {
                beforeEach(function() {
                    this.player1.reap(this.senatorBracchus);
                });

                it('should exalt bracchus', function() {
                    expect(this.senatorBracchus.tokens.amber).toBe(1);
                });

                describe('and the turn comes back around', function() {
                    beforeEach(function() {
                        this.player1.endTurn();

                        this.player2.clickPrompt('shadows');
                        this.player2.endTurn();
                    });

                    it('should prompt for spending amber on bracchus', function() {
                        expect(this.player1).toHavePrompt('How much amber do you want to use from Senator Bracchus');
                    });

                    describe('and an option is selected', function() {
                        beforeEach(function() {
                            this.player1.clickPrompt('1');
                        });

                        it('should prompt the forge key prompt', function() {
                            expect(this.player1).toHavePrompt('Which key would you like to forge?');
                        });
                    });
                });
            });
        });
    });
});
