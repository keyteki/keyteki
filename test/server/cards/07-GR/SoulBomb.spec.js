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
            this.player1.useAction(this.soulBomb, true);
            expect(this.troll.tokens.damage).toBe(undefined);
            expect(this.cpoZytar.tokens.damage).toBe(undefined);
            expect(this.flaxia.location).toBe('play area');
            expect(this.flaxia.tokens.damage).toBe(undefined);
            expect(this.mollymawk.tokens.damage).toBe(undefined);
            expect(this.soulBomb.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 4 damage to each creature if haunted', function () {
            this.player1.play(this.pressGang);
            this.player1.useAction(this.soulBomb, true);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.cpoZytar.tokens.damage).toBe(3);
            expect(this.flaxia.location).toBe('discard');
            expect(this.mollymawk.tokens.damage).toBe(4);
            expect(this.soulBomb.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
