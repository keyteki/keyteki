describe('Vow of Blood', function () {
    describe('its ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['pelf'],
                    hand: ['vow-of-blood']
                },
                player2: {
                    inPlay: ['troll', 'nexus', 'sequis']
                }
            });
        });

        it('deal no damage if there are no damaged enemy creatures', function () {
            this.player1.play(this.vowOfBlood);
            expect(this.troll.damage).toBe(0);
            expect(this.nexus.damage).toBe(0);
            expect(this.sequis.damage).toBe(0);
            expect(this.pelf.damage).toBe(0);
            expect(this.player1.amber).toBe(2);
        });

        it('deal 2 damage to every enemy creature that is damaged', function () {
            this.troll.damage = 1;
            this.nexus.damage = 1;
            this.sequis.damage = 1;
            this.player1.play(this.vowOfBlood);
            expect(this.troll.damage).toBe(3);
            expect(this.nexus.location).toBe('discard');
            expect(this.sequis.damage).toBe(1); // armor
            expect(this.pelf.damage).toBe(0);
            expect(this.player1.amber).toBe(2);
        });

        it('does not deal 2 damage to a friendly creature that is damaged', function () {
            this.pelf.damage = 1;
            this.player1.play(this.vowOfBlood);
            expect(this.troll.damage).toBe(0);
            expect(this.nexus.damage).toBe(0);
            expect(this.sequis.damage).toBe(0);
            expect(this.pelf.damage).toBe(1);
            expect(this.player1.amber).toBe(2);
        });
    });
});
