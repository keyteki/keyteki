describe('Winds of Death', function () {
    describe("Winds of Death's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['winds-of-death'],
                    inPlay: ['flaxia'],
                    discard: ['a-strong-feeling', 'dust-pixie', 'library-of-babble', 'shadys']
                },
                player2: {
                    inPlay: ['charette', 'cpo-zytar'],
                    discard: ['medic-ingram', 'stealth-mode']
                }
            });
        });

        it('archives each creature in each discard', function () {
            this.player1.play(this.windsOfDeath);
            expect(this.dustPixie.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.dustPixie);
            expect(this.shadys.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.shadys);
            expect(this.medicIngram.location).toBe('archives');
            expect(this.player2.player.archives).toContain(this.medicIngram);
            expect(this.player1.player.archives.length).toBe(2);
            expect(this.player2.player.archives.length).toBe(1);
        });

        it('destroys each creature', function () {
            this.player1.play(this.windsOfDeath);
            expect(this.flaxia.location).toBe('discard');
            expect(this.charette.location).toBe('discard');
            expect(this.cpoZytar.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
