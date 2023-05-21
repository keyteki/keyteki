describe('CrimTorchtooth', function () {
    describe("CrimTorchtooth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['pelf', 'crim-torchtooth', 'bumpsy', 'umbra']
                },
                player2: {
                    inPlay: ['toad', 'gladiodontus', 'bubbles', 'fandangle']
                }
            });
        });

        it('should do splash attack', function () {
            this.player1.fightWith(this.crimTorchtooth, this.gladiodontus);
            expect(this.toad.location).toBe('discard');
            expect(this.gladiodontus.tokens.damage).toBe(7);
            expect(this.bubbles.tokens.damage).toBe(4);
            expect(this.fandangle.tokens.damage).toBe(undefined);
            this.player1.endTurn();
        });

        it('should enrage neighbors', function () {
            this.player1.fightWith(this.crimTorchtooth, this.gladiodontus);
            expect(this.pelf.tokens.enrage).toBe(1);
            expect(this.bumpsy.tokens.enrage).toBe(1);
            expect(this.crimTorchtooth.tokens.enrage).toBe(undefined);
            expect(this.umbra.tokens.enrage).toBe(undefined);
            this.player1.endTurn();
        });
    });
});
