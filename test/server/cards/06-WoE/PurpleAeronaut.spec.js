describe('Purple Aeronaut', function () {
    describe("Purple Aeronaut's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: [
                        'nautilixian',
                        'green-aeronaut',
                        'white-aeronaut',
                        'red-aeronaut',
                        'purple-aeronaut',
                        'tunk'
                    ]
                },
                player2: {
                    amber: 3,
                    inPlay: ['toad', 'umbra', 'bumpsy', 'hunting-witch']
                }
            });
        });

        it('should cause the nautilixian to gain a fight ability when 4 pilots are used', function () {
            this.player1.reap(this.greenAeronaut);
            this.player1.reap(this.whiteAeronaut);
            this.player1.reap(this.redAeronaut);
            this.player1.reap(this.purpleAeronaut);
            this.player1.fightWith(this.nautilixian, this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.toad.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.greenAeronaut.location).toBe('play area');
        });

        it('should not cause the nautilixian to gain a fight ability when 4 pilots have not been used', function () {
            this.player1.reap(this.greenAeronaut);
            this.player1.reap(this.whiteAeronaut);
            this.player1.reap(this.redAeronaut);
            this.player1.reap(this.tunk);
            this.player1.fightWith(this.nautilixian, this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.toad.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.greenAeronaut.location).toBe('play area');
        });

        it('should not give non-nautilixian creatures the fight ability', function () {
            this.player1.reap(this.greenAeronaut);
            this.player1.reap(this.whiteAeronaut);
            this.player1.reap(this.redAeronaut);
            this.player1.reap(this.purpleAeronaut);
            this.player1.fightWith(this.tunk, this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.toad.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.greenAeronaut.location).toBe('play area');
        });
    });
});
