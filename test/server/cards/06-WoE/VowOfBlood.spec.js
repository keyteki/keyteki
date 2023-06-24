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
            expect(this.troll.tokens.damage).toBe(undefined);
            expect(this.nexus.tokens.damage).toBe(undefined);
            expect(this.sequis.tokens.damage).toBe(undefined);
            expect(this.pelf.tokens.damage).toBe(undefined);
            expect(this.player1.amber).toBe(2);
        });

        it('deal 2 damage to every enemy creature that is damaged', function () {
            this.troll.tokens.damage = 1;
            this.nexus.tokens.damage = 1;
            this.sequis.tokens.damage = 1;
            this.player1.play(this.vowOfBlood);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.nexus.location).toBe('discard');
            expect(this.sequis.tokens.damage).toBe(1); // armor
            expect(this.pelf.tokens.damage).toBe(undefined);
            expect(this.player1.amber).toBe(2);
        });

        it('does not deal 2 damage to a friendly creature that is damaged', function () {
            this.pelf.tokens.damage = 1;
            this.player1.play(this.vowOfBlood);
            expect(this.troll.tokens.damage).toBe(undefined);
            expect(this.nexus.tokens.damage).toBe(undefined);
            expect(this.sequis.tokens.damage).toBe(undefined);
            expect(this.pelf.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(2);
        });
    });
});
