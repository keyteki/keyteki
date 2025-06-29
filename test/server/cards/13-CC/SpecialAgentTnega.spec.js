describe('Special Agent Tnega', function () {
    describe("Special Agent Tnega's power modification", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['troll', 'special-agent-tnega', 'blypyp'],
                    hand: ['number-612']
                },
                player2: {
                    inPlay: ['dust-pixie', 'silvertooth']
                }
            });
        });

        it('should get +2 power for each Mars neighbor', function () {
            expect(this.specialAgentTnega.power).toBe(4);
        });

        it('should get power from multiple Mars neighbors', function () {
            this.player1.moveCard(this.troll, 'discard');
            this.player1.playCreature(this.number612, true);
            expect(this.specialAgentTnega.power).toBe(6);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
