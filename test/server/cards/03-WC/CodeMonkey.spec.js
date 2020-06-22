describe('Code Monkey', function () {
    describe('When played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['code-monkey'],
                    inPlay: ['helper-bot', 'titan-mechanic', 'bad-penny', 'troll']
                },
                player2: {
                    inPlay: ['snufflegator', 'halacor']
                }
            });
        });

        describe('next to two logos creatures', function () {
            beforeEach(function () {
                this.player1.playCreature(this.codeMonkey, true, true);
                this.player1.clickCard(this.titanMechanic);
            });

            it('should give 2 amber', function () {
                expect(this.player1.amber).toBe(2);
            });
        });

        describe('next to only one logos creature', function () {
            beforeEach(function () {
                this.player1.playCreature(this.codeMonkey, true, true);
                this.player1.clickCard(this.badPenny);
            });

            it('should not give 2 amber', function () {
                expect(this.player1.amber).toBe(0);
            });
        });
    });
});
