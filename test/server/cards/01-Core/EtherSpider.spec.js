describe('Ether Spider', function() {
    integration(function() {
        describe('Ether Spider\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        house: 'sanctum',
                        inPlay: ['sequis'],
                        hand: ['virtuous-works']
                    },
                    player2: {
                        amber: 1,
                        inPlay: ['ether-spider']
                    }
                });
            });

            it('should take amber from playing cards', function() {
                this.player1.play(this.virtuousWorks);
                expect(this.player1.amber).toBe(0);
                expect(this.etherSpider.tokens.amber).toBe(3);
            });

            it('should take amber from reaping, but not from capturing', function() {
                expect(this.player2.amber).toBe(1);
                this.player1.reap(this.sequis);
                expect(this.player1.amber).toBe(0);
                expect(this.etherSpider.tokens.amber).toBe(1);
                expect(this.player2.amber).toBe(0);
                expect(this.sequis.tokens.amber).toBe(1);
            });

            it('should deal no damage when attacked', function() {
                this.player1.fightWith(this.sequis, this.etherSpider);
                expect(this.sequis.hasToken('damage')).toBe(false);
                expect(this.etherSpider.tokens.damage).toBe(4);
            });

            it('should deal no damage when fighting', function() {
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('mars');
                this.player2.fightWith(this.etherSpider, this.sequis);
                expect(this.sequis.hasToken('damage')).toBe(false);
                expect(this.etherSpider.tokens.damage).toBe(4);
            });
        });
    });
});
