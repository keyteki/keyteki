describe('Lamindra', function () {
    describe("Lamindra's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['bad-penny', 'lamindra', 'umbra', 'redlock']
                },
                player2: {
                    inPlay: ['snufflegator', 'halacor']
                }
            });
        });

        it('should give its neighbors elusive', function () {
            this.player1.play(this.badPenny);
            this.player1.play(this.lamindra);
            this.player1.play(this.umbra);
            this.player1.play(this.redlock);
            expect(this.badPenny.getKeywordValue('elusive')).toBe(1);
            expect(this.umbra.getKeywordValue('elusive')).toBe(1);
            expect(this.redlock.getKeywordValue('elusive')).toBe(0);
        });
        it('should give its neighbors elusive when deployed', function () {
            this.player1.play(this.badPenny);
            this.player1.play(this.umbra);
            this.player1.play(this.redlock);
            this.player1.play(this.lamindra, true, true);
            this.player1.clickCard(this.umbra);
            expect(this.badPenny.getKeywordValue('elusive')).toBe(1);
            expect(this.umbra.getKeywordValue('elusive')).toBe(1);
            expect(this.redlock.getKeywordValue('elusive')).toBe(0);
        });
        it('should give its new neighbor elusive if an existing one is destroyed', function () {
            this.player1.play(this.badPenny);
            this.player1.play(this.lamindra);
            this.player1.play(this.umbra);
            this.player1.play(this.redlock);
            expect(this.badPenny.getKeywordValue('elusive')).toBe(1);
            expect(this.umbra.getKeywordValue('elusive')).toBe(1);
            expect(this.redlock.getKeywordValue('elusive')).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.halacor, this.umbra);
            expect(this.umbra.location).toBe('play area');
            expect(this.halacor.location).toBe('play area');
            this.player2.fightWith(this.snufflegator, this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.redlock.getKeywordValue('elusive')).toBe(1);
        });
    });
});
