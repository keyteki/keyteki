describe('Nepeta Gigantica', function() {
    integration(function() {
        describe('Nepeta Gigantica\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        inPlay: ['nepeta-gigantica','tantadlin', 'dextre', 'moor-wolf']
                    },
                    player2: {
                        inPlay: ['drummernaut']
                    }
                });
            });
            it('should give the option to choose between stunning P>5 or Giant', function() {
                this.player1.clickCard(this.nepetaGigantica);
                this.player1.clickPrompt('Use this card\'s Action ability');
                expect(this.player1).toHavePromptButton('5 or higher Power Creature');
                expect(this.player1).toHavePromptButton('Giant Creature');
            });
            it('should give the appropriate choices when choosing P>5', function() {
                this.player1.clickCard(this.nepetaGigantica);
                this.player1.clickPrompt('Use this card\'s Action ability');
                expect(this.player1).toHavePromptButton('5 or higher Power Creature');
                expect(this.player1).toHavePromptButton('Giant Creature');
                this.player1.clickPrompt('5 or higher Power Creature');
                expect(this.player1).toBeAbleToSelect(this.tantadlin);
                expect(this.player1).toBeAbleToSelect(this.drummernaut);
                expect(this.player1).not.toBeAbleToSelect(this.moorWolf);
                expect(this.player1).not.toBeAbleToSelect(this.dextre);
                this.player1.clickCard(this.tantadlin);
                expect(this.tantadlin.stunned).toBe(true);
            });
            it('should give the appropriate choices when choosing Giant', function() {
                this.player1.clickCard(this.nepetaGigantica);
                this.player1.clickPrompt('Use this card\'s Action ability');
                expect(this.player1).toHavePromptButton('5 or higher Power Creature');
                expect(this.player1).toHavePromptButton('Giant Creature');
                this.player1.clickPrompt('Giant Creature');
                expect(this.player1).not.toBeAbleToSelect(this.tantadlin);
                expect(this.player1).toBeAbleToSelect(this.drummernaut);
                expect(this.player1).not.toBeAbleToSelect(this.moorWolf);
                expect(this.player1).not.toBeAbleToSelect(this.dextre);
                this.player1.clickCard(this.drummernaut);
                expect(this.drummernaut.stunned).toBe(true);
            });
        });
    });
});
