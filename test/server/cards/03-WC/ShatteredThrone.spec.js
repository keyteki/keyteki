describe('Shattered Throne', function() {
    integration(function() {
        describe('Shattered Throne Ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 3,
                        house: 'brobnar',
                        inPlay: ['brammo', 'ganger-chieftain', 'foozle', 'culf-the-quiet', 'shattered-throne']
                    },
                    player2: {
                        amber: 3,
                        inPlay: ['silvertooth', 'bad-penny', 'umbra', 'redlock']
                    }
                });
            });
            it('should cause a creature who fights to capture 1A if it survives..', function() {
                this.player1.fightWith(this.brammo, this.silvertooth);
                expect(this.brammo.tokens.amber).toBe(1);
                this.player1.fightWith(this.gangerChieftain, this.badPenny);
                expect(this.gangerChieftain.tokens.amber).toBe(1);
                this.player1.fightWith(this.foozle, this.umbra);
                expect(this.foozle.tokens.amber).toBe(1);
                expect(this.player2.amber).toBe(0);
            });
        });
    });
});
