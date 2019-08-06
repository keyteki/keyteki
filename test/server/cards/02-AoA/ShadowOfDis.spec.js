describe('Shadow of Dis', function() {
    integration(function() {
        describe('Shadow of Dis\' ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        inPlay: ['autocannon','hunting-witch'],
                        hand: ['bumpsy', 'valdr','dew-faerie', 'halacor']
                    },
                    player2: {
                        hand: ['shadow-of-dis', 'dust-imp', 'shooler']
                    }
                });
            });
            it('should not blank artifacts', function() {
                this.player1.endTurn();
                this.player2.clickPrompt('dis');
                this.player2.play(this.shadowOfDis);
                this.player2.play(this.dustImp);
                expect(this.dustImp.tokens.damage).toBe(1);
            });
            it('should blank creatures', function() {
                this.player1.play(this.dewFaerie);
                expect(this.player1.amber).toBe(1);
                this.player1.endTurn();
                this.player2.clickPrompt('dis');
                this.player2.play(this.shadowOfDis);
                this.player2.endTurn();
                this.player1.clickPrompt('brobnar');
                this.player1.play(this.valdr);
                expect(this.valdr.tokens.damage).toBe(1);
                expect(this.player1.amber).toBe(1);
            });
            it('should wear off after the opponent\'s turn', function() {
                this.player1.play(this.dewFaerie);
                expect(this.player1.amber).toBe(1);
                this.player1.endTurn();
                this.player2.clickPrompt('dis');
                this.player2.play(this.shadowOfDis);
                this.player2.endTurn();
                this.player1.clickPrompt('brobnar');
                this.player1.play(this.valdr);
                expect(this.valdr.tokens.damage).toBe(1);
                expect(this.player1.amber).toBe(1);
                this.player1.endTurn();
                this.player2.clickPrompt('dis');
                this.player2.endTurn();
                this.player1.clickPrompt('brobnar');
                this.player1.play(this.bumpsy);
                expect(this.player1.amber).toBe(2);
            });
        });
    });
});
