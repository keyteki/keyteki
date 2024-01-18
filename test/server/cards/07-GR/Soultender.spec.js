describe('Soultender', function () {
    describe("Soultender's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['soultender'],
                    inPlay: ['charette', 'the-grim-reaper', 'soultender']
                },
                player2: {
                    amber: 2,
                    inPlay: ['shadow-self', 'flaxia']
                }
            });
            this.soultender2 = this.player1.player.hand[0];
            this.charette.amber = 3;
            this.theGrimReaper.amber = 2;
            this.soultender2.amber = 1;
            this.shadowSelf.amber = 1;
            this.flaxia.amber = 4;
            this.shadowSelf.tokens.damage = 5;
        });

        it('removes amber from each Specter on play', function () {
            this.player1.playCreature(this.soultender2);
            expect(this.charette.amber).toBe(3);
            expect(this.theGrimReaper.amber).toBe(0);
            expect(this.soultender.amber).toBe(0);
            expect(this.soultender2.amber).toBe(0);
            expect(this.shadowSelf.amber).toBe(0);
            expect(this.flaxia.amber).toBe(4);
        });

        it('heals and wards each Specter on play', function () {
            this.player1.playCreature(this.soultender2);
            expect(this.charette.warded).toBe(false);
            expect(this.theGrimReaper.warded).toBe(true);
            expect(this.soultender.warded).toBe(true);
            expect(this.soultender2.warded).toBe(true);
            expect(this.shadowSelf.warded).toBe(true);
            expect(this.flaxia.warded).toBe(false);
            expect(this.shadowSelf.tokens.damage).toBe(undefined);
        });

        it('also removes amber and wards on reap', function () {
            this.player1.reap(this.soultender);
            expect(this.charette.amber).toBe(3);
            expect(this.theGrimReaper.amber).toBe(0);
            expect(this.soultender.amber).toBe(0);
            expect(this.shadowSelf.amber).toBe(0);
            expect(this.flaxia.amber).toBe(4);
            expect(this.charette.warded).toBe(false);
            expect(this.theGrimReaper.warded).toBe(true);
            expect(this.soultender.warded).toBe(true);
            expect(this.shadowSelf.warded).toBe(true);
            expect(this.flaxia.warded).toBe(false);
            expect(this.shadowSelf.tokens.damage).toBe(undefined);
        });
    });
});
