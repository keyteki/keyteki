describe('Shameful Display', function() {
    integration(function() {
        describe('Shameful Display\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['isawa-kaede', 'shiba-tsukune'],
                        hand: ['seeker-of-knowledge', 'assassination']
                    },
                    player2: {
                        provinces: ['defend-the-wall'],
                        inPlay: ['shinjo-outrider'],
                        hand: ['display-of-power', 'fine-katana']
                    }
                });
            });

            it('should only be triggerable when there are 2 targets', function() {

            });

            it('should require 2 targets', function() {

            });

            it('shouldn\'t allow a target which cannot be honored or dishonored', function() {

            });

            it('should automatically honor one character and dishonor the other if that is the only way to change the game state', function() {

            });

            it('should prompt to dishonor a character if neither character can be honored', function() {

            });

            it('should prompt to honor a character if neither character can be dishonored', function() {

            });

            it('should prompt the player to choose honor or dishonor if either character can be honored or dishonored', function() {

            });

            it('should trigger young rumormonger for both the honor and dishonor state changes', function() {

            });

            it('should only trigger rumormonger for the honor state change if the dishonor target can\'t be dishonored', function() {

            });

            it('should only trigger rumormonger for the dishonor state change if the honor target can\'t be honored', function() {

            });

            it('when honor and dishonor are moved to an ordinary target, it should end up ordinary', function() {

            });
        });
    });
});
