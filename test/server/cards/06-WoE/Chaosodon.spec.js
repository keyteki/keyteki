describe('Chaosodon', function () {
    describe("Chaosodon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['pelf', 'chaosodon', 'bumpsy', 'questor-jarta']
                },
                player2: {
                    inPlay: ['gub', 'murkens', 'umbra', 'charette']
                }
            });
        });

        it('damage all neighbors', function () {
            this.player1.fightWith(this.chaosodon, this.umbra);
            expect(this.pelf.location).toBe('discard');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.bumpsy.tokens.damage).toBe(3);
            expect(this.questorJarta.location).toBe('play area');
            expect(this.questorJarta.tokens.damage).toBe(undefined);
            expect(this.gub.location).toBe('play area');
            expect(this.gub.tokens.damage).toBe(undefined);
            expect(this.murkens.location).toBe('discard');
            expect(this.umbra.location).toBe('discard');
            expect(this.charette.location).toBe('play area');
            expect(this.charette.tokens.damage).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
