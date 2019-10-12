describe('The Floor Is Lava', function() {
    integration(function() {
        describe('The Floor Is Lava\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'brobnar',
                        hand: ['igon-the-terrible', 'igon-the-green'],
                        inPlay: ['the-floor-is-lava', 'dominator-bauble', 'groke', 'ganger-chieftain']
                    },
                    player2: {
                        inPlay: ['mother', 'troll', 'dextre']
                    }
                });
            });
            it('should prompt to deal damage to a friendly creature and an enemy creature', function() {
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.endTurn();
                this.player1.clickPrompt('brobnar');
                expect(this.player1).toHavePrompt('The Floor is Lava');
                expect(this.player1).toBeAbleToSelect(this.groke);
                expect(this.player1).toBeAbleToSelect(this.gangerChieftain);
                expect(this.player1).not.toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.mother);
                expect(this.player1).not.toBeAbleToSelect(this.dextre);
                this.player1.clickCard(this.groke);
                expect(this.player1).toHavePrompt('The Floor is Lava');
                expect(this.player1).not.toBeAbleToSelect(this.groke);
                expect(this.player1).not.toBeAbleToSelect(this.gangerChieftain);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.mother);
                expect(this.player1).toBeAbleToSelect(this.dextre);
                this.player1.clickCard(this.dextre);
                expect(this.groke.tokens.damage).toBe(1);
                expect(this.dextre.tokens.damage).toBe(1);
            });
        });
    });
});
