describe('Soul Bomb', function () {
    describe("Soul Bomb's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['press-gang'],
                    inPlay: ['soul-bomb', 'troll'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 1,
                    inPlay: ['cpo-zytar', 'flaxia', 'mollymawk']
                }
            });
        });

        it('does nothing if not haunted', function () {
            this.player1.useOmni(this.soulBomb);
            expect(this.troll.damage).toBe(0);
            expect(this.cpoZytar.damage).toBe(0);
            expect(this.flaxia.location).toBe('play area');
            expect(this.flaxia.damage).toBe(0);
            expect(this.mollymawk.damage).toBe(0);
            expect(this.soulBomb.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 4 damage to each creature if haunted', function () {
            this.player1.play(this.pressGang);
            this.player1.useOmni(this.soulBomb);
            expect(this.troll.damage).toBe(4);
            expect(this.cpoZytar.damage).toBe(3);
            expect(this.flaxia.location).toBe('discard');
            expect(this.mollymawk.damage).toBe(4);
            expect(this.soulBomb.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
