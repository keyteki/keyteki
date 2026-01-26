describe('CrimTorchtooth', function () {
    describe("CrimTorchtooth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['pelf', 'crim-torchtooth', 'bumpsy', 'umbra']
                },
                player2: {
                    inPlay: ['toad', 'gladiodontus', 'bubbles', 'fandangle', 'harmonia']
                }
            });
        });

        it('should do splash attack', function () {
            this.player1.fightWith(this.crimTorchtooth, this.gladiodontus);
            expect(this.toad.location).toBe('discard');
            expect(this.gladiodontus.damage).toBe(7);
            expect(this.bubbles.damage).toBe(4);
            expect(this.fandangle.damage).toBe(0);
            this.player1.endTurn();
        });

        it('should do splash attack even when fighting an elusive creature', function () {
            this.player1.fightWith(this.crimTorchtooth, this.harmonia);
            expect(this.harmonia.location).toBe('play area');
            expect(this.fandangle.location).toBe('discard');
        });

        it('should enrage neighbors', function () {
            this.player1.fightWith(this.crimTorchtooth, this.gladiodontus);
            expect(this.pelf.enraged).toBe(true);
            expect(this.bumpsy.enraged).toBe(true);
            expect(this.crimTorchtooth.enraged).toBe(false);
            expect(this.umbra.enraged).toBe(false);
            this.player1.endTurn();
        });
    });
});
