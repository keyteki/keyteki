describe('Fangtooth Cavern', function() {
    integration(function() {
        describe('Fangtooth Cavern\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        inPlay: ['fangtooth-cavern','mighty-tiger', 'dextre']
                    },
                    player2: {
                        inPlay: ['dust-imp', 'dust-pixie']
                    }
                });
            });

            it('should destroy the least powerful creature at the end of p1 turn', function() {
                this.player1.endTurn();
                expect(this.player1).toBeAbleToSelect(this.dustPixie);
                expect(this.player1).not.toBeAbleToSelect(this.dustImp);
                expect(this.player1).not.toBeAbleToSelect(this.mightyTiger);
                expect(this.player1).not.toBeAbleToSelect(this.dextre);
                this.player1.clickCard(this.dustPixie);
                expect(this.dustPixie.location).toBe('discard');
                this.player2.clickPrompt('dis');
                this.player2.endTurn();
                expect(this.dustImp.location).toBe('play area');
                this.player1.clickPrompt('untamed');
                this.player1.endTurn();
                expect(this.player1).toBeAbleToSelect(this.dustImp);
                expect(this.player1).not.toBeAbleToSelect(this.mightyTiger);
                expect(this.player1).not.toBeAbleToSelect(this.dextre);
                this.player1.clickCard(this.dustImp);
                expect(this.dustImp.location).toBe('discard');
            });
        });
    });
});
