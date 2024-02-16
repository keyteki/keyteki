describe('Into the Warp', function () {
    describe("Into the Warp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['into-the-warp'],
                    inPlay: ['batdrone'],
                    discard: ['poke', 'flaxia']
                },
                player2: {
                    amber: 2,
                    inPlay: ['urchin', 'mother', 'troll'],
                    discard: ['noddy-the-thief']
                }
            });
            this.player1.moveCard(this.poke, 'deck');
            this.player2.moveCard(this.noddyTheThief, 'deck');
        });

        it('destroys creatures when both players discard', function () {
            this.player1.play(this.intoTheWarp);
            expect(this.batdrone.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.mother.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.poke.location).toBe('discard');
            expect(this.noddyTheThief.location).toBe('discard');
        });

        it('destroys creatures when only opponent discards', function () {
            this.player1.player.deck = [];
            this.player1.play(this.intoTheWarp);
            expect(this.batdrone.location).toBe('play area');
            expect(this.urchin.location).toBe('discard');
            expect(this.mother.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.noddyTheThief.location).toBe('discard');
        });

        it('destroys creatures when only player discards', function () {
            this.player2.player.deck = [];
            this.player1.play(this.intoTheWarp);
            expect(this.batdrone.location).toBe('discard');
            expect(this.urchin.location).toBe('play area');
            expect(this.mother.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.poke.location).toBe('discard');
        });

        it('does nothing when no player discards', function () {
            this.player1.player.deck = [];
            this.player2.player.deck = [];
            this.player1.play(this.intoTheWarp);
            expect(this.batdrone.location).toBe('play area');
            expect(this.urchin.location).toBe('play area');
            expect(this.mother.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
        });

        it('destroys no creatures when no creatures are in play', function () {
            this.player1.moveCard(this.batdrone, 'discard');
            this.player2.moveCard(this.urchin, 'discard');
            this.player2.moveCard(this.mother, 'discard');
            this.player2.moveCard(this.troll, 'discard');
            this.player1.play(this.intoTheWarp);
            expect(this.poke.location).toBe('discard');
            expect(this.noddyTheThief.location).toBe('discard');
        });

        it('destroys no creatures when no creatures match the houses', function () {
            this.player1.moveCard(this.flaxia, 'deck');
            this.player2.moveCard(this.urchin, 'discard');
            this.player1.play(this.intoTheWarp);
            expect(this.batdrone.location).toBe('play area');
            expect(this.mother.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.flaxia.location).toBe('discard');
            expect(this.noddyTheThief.location).toBe('discard');
        });
    });
});
