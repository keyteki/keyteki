describe('Discourage Pursuit', function() {
    integration(function() {
        describe('Discourage Pursuit\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shosuro-miyako','bayushi-manipulator'],
                        hand: ['discourage-pursuit']
                    },
                    player2: {
                        inPlay: ['akodo-toturi']
                    }
                });
                this.toturi = this.player2.findCardByName('akodo-toturi');
                this.noMoreActions();
            });

            it('should correctly trigger with a shinobi in play', function() {
                this.initiateConflict({
                    attackers: ['bayushi-manipulator'],
                    defenders: [this.toturi]
                });
                this.player2.pass();
                this.player1.clickCard('discourage-pursuit');
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect('bayushi-manipulator');
                expect(this.player1).toBeAbleToSelect(this.toturi);
                this.player1.clickCard(this.toturi);
                expect(this.player1).toBeAbleToSelect('shosuro-miyako');
                this.player1.clickCard('shosuro-miyako');


                expect(this.toturi.getMilitarySkill()).toBe(2);

            });

            it('should not trigger without a shinobi in play', function() {
                this.initiateConflict({
                    attackers: ['bayushi-manipulator'],
                    defenders: [this.toturi]
                });
                this.player2.pass();
                this.player1.moveCard('shosuro-miyako', 'dynasty discard pile');
                this.player1.clickCard('discourage-pursuit');
                expect(this.player1).not.toHavePrompt('Choose a character');
            });

            it('should have DEF effect on GHI', function() {

            });
        });
    });
});
