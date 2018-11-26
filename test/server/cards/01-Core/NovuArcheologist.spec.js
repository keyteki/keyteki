describe('Novu Archeologist', function() {
    integration(function() {
        describe('Novu Archeologist\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        inPlay: ['novu-archaeologist'],
                        discard: ['labwork']
                    },
                    player2: {
                        amber: 5,
                        inPlay: ['nexus']
                    }
                });
            });

            fit('should archive a card from discard', function() {
                console.log(this.novuArchaeologist.getActions().map(action => [action.title, action.meetsRequirements()]))
                this.player1.clickCard(this.novuArchaeologist);
                this.player1.clickPrompt('Use this card\'s Action ability');
                expect(this.player1).toHavePrompt('Novu Archeologist');
                this.player1.clickCard(this.labwork);
                expect(this.labwork.location).toBe('archives');
            });
        });
    });
});
