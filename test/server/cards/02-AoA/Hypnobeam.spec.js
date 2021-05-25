describe('Hypnobeam', function () {
    describe("Hypnobeam's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'mars',
                    inPlay: ['zorg'],
                    hand: ['hypnobeam']
                },
                player2: {
                    inPlay: ['urchin', 'ether-spider']
                }
            });
        });

        it('should take control of an enemy shadows creature', function () {
            this.player1.play(this.hypnobeam);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.etherSpider);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.urchin.hasHouse('shadows')).toBe(true);
            expect(this.urchin.hasHouse('mars')).toBe(false);
        });

        it('should take control of an enemy mars creature and use it immediately', function () {
            this.player1.play(this.hypnobeam);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.etherSpider);
            this.player1.clickCard(this.etherSpider);
            this.player1.clickPrompt('Left');
            expect(this.etherSpider.controller).toBe(this.player1.player);
            expect(this.etherSpider.hasHouse('mars')).toBe(true);
            this.player1.reap(this.etherSpider);
            expect(this.player1.amber).toBe(4);
        });
    });
});
