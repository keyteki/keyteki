describe('Genetic Blast', function () {
    describe("Genetic Blast's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['pelf', 'ether-spider'],
                    hand: ['genetic-blast']
                },
                player2: {
                    inPlay: ['pelf', 'pelf', 'bumpsy']
                }
            });

            this.pelf2 = this.player2.player.creaturesInPlay[0];
            this.pelf3 = this.player2.player.creaturesInPlay[1];
            this.pelf3.tokens.ward = 1;
        });

        it('should deal 2 damage to each creature with that name', function () {
            this.player1.play(this.geneticBlast);
            this.player1.clickCard(this.pelf2);
            this.expectReadyToTakeAction(this.player1);
            expect(this.pelf.tokens.damage).toBe(2);
            expect(this.pelf2.tokens.damage).toBe(2);
            expect(this.pelf3.tokens.damage).toBe(undefined);
            expect(this.pelf3.tokens.ward).toBe(undefined);
            expect(this.bumpsy.tokens.damage).toBe(undefined);
            expect(this.etherSpider.tokens.damage).toBe(undefined);
        });

        it('should be able to target friendly creatures', function () {
            this.player1.play(this.geneticBlast);
            this.player1.clickCard(this.pelf);
            this.expectReadyToTakeAction(this.player1);
            expect(this.pelf.tokens.damage).toBe(2);
            expect(this.pelf2.tokens.damage).toBe(2);
            expect(this.pelf3.tokens.damage).toBe(undefined);
            expect(this.pelf3.tokens.ward).toBe(undefined);
            expect(this.bumpsy.tokens.damage).toBe(undefined);
            expect(this.etherSpider.tokens.damage).toBe(undefined);
        });
    });
});
