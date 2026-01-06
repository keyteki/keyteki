describe('Crimson Churning', function () {
    describe("Crimson Churning's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: ['crimson-churning'],
                    inPlay: ['legendary-keyraken', 'crushing-tentacle', 'grappling-tentacle']
                },
                player2: {
                    inPlay: ['troll', 'lamindra']
                }
            });
        });

        it('deals 1 damage per tentacle to enemy creatures', function () {
            this.player1.play(this.crimsonChurning);
            expect(this.player1).toHavePrompt('Crimson Churning');
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.lamindra);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
