describe('Ether Spider', function () {
    describe("Ether Spider's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['sequis'],
                    hand: ['virtuous-works', 'inspiration']
                },
                player2: {
                    amber: 1,
                    inPlay: ['ether-spider']
                }
            });
        });

        it('should take amber from playing cards', function () {
            this.player1.play(this.virtuousWorks);
            expect(this.player1.amber).toBe(0);
            expect(this.etherSpider.tokens.amber).toBe(3);
        });

        it('should take amber from reaping, but not from capturing', function () {
            expect(this.player2.amber).toBe(1);
            this.player1.reap(this.sequis);
            expect(this.player1.amber).toBe(0);
            expect(this.etherSpider.tokens.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.sequis.tokens.amber).toBe(1);
        });

        it('should return amber to opponent when it leaves play', function () {
            this.player1.play(this.virtuousWorks);
            expect(this.player1.amber).toBe(0);
            expect(this.etherSpider.tokens.amber).toBe(3);
            this.player1.fightWith(this.sequis, this.etherSpider);
            this.player1.play(this.inspiration);
            this.player1.clickCard(this.sequis);
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.etherSpider);
            expect(this.etherSpider.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
        });

        it('should deal no damage when attacked', function () {
            this.player1.fightWith(this.sequis, this.etherSpider);
            expect(this.sequis.hasToken('damage')).toBe(false);
            expect(this.etherSpider.tokens.damage).toBe(4);
        });

        it('should deal no damage when fighting', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.fightWith(this.etherSpider, this.sequis);
            expect(this.sequis.hasToken('damage')).toBe(false);
            expect(this.etherSpider.tokens.damage).toBe(4);
        });
    });

    describe('Ether Spider and mind control', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['collar-of-subordination', 'lifeward']
                },
                player2: {
                    inPlay: ['ether-spider', 'valdr'],
                    hand: ['punch']
                }
            });
        });

        it('should take amber from the controllers opponent before mind control', function () {
            this.player1.play(this.lifeward);
            expect(this.player1.amber).toBe(0);
            expect(this.etherSpider.tokens.amber).toBe(1);
        });

        it('should not steal the new controllers amber after being mind controlled', function () {
            this.player1.playUpgrade(this.collarOfSubordination, this.etherSpider);
            expect(this.etherSpider.controller).toBe(this.player1.player);
            this.player1.play(this.lifeward);
            expect(this.player1.amber).toBe(1);
            expect(this.etherSpider.hasToken('amber')).toBe(false);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.punch);
            this.player2.clickCard(this.etherSpider);
            expect(this.player2.amber).toBe(0);
            expect(this.etherSpider.tokens.amber).toBe(1);
            expect(this.etherSpider.tokens.damage).toBe(3);
        });

        it('should give amber to the correct player when killed', function () {
            this.player1.play(this.lifeward);
            this.player1.playUpgrade(this.collarOfSubordination, this.etherSpider);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.punch);
            this.player2.clickCard(this.etherSpider);
            this.player2.fightWith(this.valdr, this.etherSpider);
            expect(this.etherSpider.location).toBe('discard');
            expect(this.player2.amber).toBe(2);
            expect(this.player1.amber).toBe(0);
        });
    });
});
