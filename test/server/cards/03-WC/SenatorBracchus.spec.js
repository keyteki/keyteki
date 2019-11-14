describe('Senator Bracchus', function() {
    integration(function() {
        describe('when on the board', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 4,
                        house: 'saurian',
                        inPlay: ['senator-bracchus'],
                        hand: ['grimlocus-dux']
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
                    expect(this.player1.amber).toBe(5);
                });

                describe('and the turn comes back around', function() {
                    beforeEach(function() {
                        this.player1.endTurn();

                        this.player2.clickPrompt('shadows');
                        this.player2.endTurn();
                    });

                    it('should prompt the forge key prompt', function() {
                        expect(this.player1).toHavePrompt('Which key would you like to forge?');
                    });
                });
            });

            describe('with another creature', function() {
                beforeEach(function() {
                    this.player1.play(this.grimlocusDux);
                    this.player1.reap(this.senatorBracchus);
                    this.player1.endTurn();

                    this.player2.clickPrompt('shadows');
                    this.player2.endTurn();
                });

                it('should allow spending amber from both creatures', function() {
                    expect(this.grimlocusDux.tokens.amber).toBe(2);
                    expect(this.senatorBracchus.tokens.amber).toBe(1);
                    expect(this.player1).toHavePrompt('How much amber do you want to use from Senator Bracchus');
                    this.player1.clickPrompt('1');
                    expect(this.player1).toHavePrompt('How much amber do you want to use from Grimlocus Dux');
                    this.player1.clickPrompt('1');
                    expect(this.player1).toHavePrompt('Which key would you like to forge?');
                    expect(this.grimlocusDux.tokens.amber).toBe(1);
                    expect(this.senatorBracchus.hasToken('amber')).toBe(false);
                    this.player1.clickPrompt('Red');
                    expect(this.player1.amber).toBe(1);
                });
            });
        });
    });
});
