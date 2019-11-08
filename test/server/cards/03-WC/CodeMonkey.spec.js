describe('Code Monkey', function () {
    integration(function () {
        describe('When played', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        amber: 0,
                        house: 'logos',
                        hand: ['code-monkey'],
                        inPlay: ['helper-bot', 'titan-mechanic', 'bad-penny', 'troll']
                    },
                    player2: {
                        inPlay: ['snufflegator', 'halacor']
                    }
                });
            });

            it('should give 2 amber', function () {
                this.player1.playCreature(this.codeMonkey, true, true);
                this.player1.clickCard(this.titanMechanic);
                expect(this.player1.amber).toBe(2);
            });

            it('next to only one logos creature should not give 2 amber', function () {
                this.player1.playCreature(this.codeMonkey, true, true);
                this.player1.clickCard(this.badPenny);
                expect(this.player1.amber).toBe(0);
            });
        });
    });
});
