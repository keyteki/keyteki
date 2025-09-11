describe('Proton Siphon', function () {
    describe("Proton Siphon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['proton-siphon', 'stealth-mode'],
                    inPlay: ['cpo-zytar'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['kelifi-dragon', 'troll', 'hunting-witch']
                }
            });
            this.player1.playUpgrade(this.protonSiphon, this.cpoZytar);
        });

        it('does nothing when not haunted', function () {
            this.player1.fightWith(this.cpoZytar, this.troll);
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.kelifiDragon.tokens.damage).toBe(undefined);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.huntingWitch.tokens.damage).toBe(undefined);
        });

        it('gives splash attack when haunted', function () {
            this.player1.play(this.stealthMode);
            this.player1.fightWith(this.cpoZytar, this.troll);
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.kelifiDragon.tokens.damage).toBe(5);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.huntingWitch.location).toBe('discard');
        });
    });
});
