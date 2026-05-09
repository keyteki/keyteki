describe('Spyyyder', function () {
    describe("Spyyyder's poison-on-flank-attack interrupt", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['spyyyder']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('gains poison and destroys the attacked enemy when attacking a flank creature', function () {
            this.player1.fightWith(this.spyyyder, this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.spyyyder.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not gain poison when attacking a non-flank creature', function () {
            this.player1.fightWith(this.spyyyder, this.krump);
            expect(this.krump.location).toBe('play area');
            expect(this.krump.damage).toBe(2);
            expect(this.spyyyder.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
