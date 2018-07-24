describe('Flooded Waste', function() {
    integration(function() {
        describe('Flooded Waste\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker', 'ikoma-prodigy']
                    },
                    player2: {
                        provinces: ['flooded-waste']
                    }
                });
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker', 'ikoma-prodigy']
                });
            });

            it('should trigger when attackers are declared', function() {
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('flooded-waste');
            });

            it('should bow each attacking character', function() {
                this.player2.clickCard('flooded-waste');
                expect(this.matsuBerserker.bowed).toBe(true);
                expect(this.ikomaProdigy.bowed).toBe(true);
            });
        });
    });
});
