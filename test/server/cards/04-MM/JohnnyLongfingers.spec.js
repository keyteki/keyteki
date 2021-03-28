describe('JohnnyLongfingers', function () {
    describe("JohnnyLongfingers's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['bad-penny', 'johnny-longfingers', 'rad-penny', 'the-shadowsmith']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'alaka', 'groke', 'ogopogo']
                }
            });
        });

        it('should steal amber for every mutant that is destroyed', function () {
            this.player1.fightWith(this.theShadowsmith, this.troll);

            expect(this.theShadowsmith.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });
    });
});
