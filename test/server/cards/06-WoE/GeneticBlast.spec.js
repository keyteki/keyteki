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
            expect(this.player1).isReadyToTakeAction();
            expect(this.pelf.damage).toBe(2);
            expect(this.pelf2.damage).toBe(2);
            expect(this.pelf3.damage).toBe(0);
            expect(this.pelf3.tokens.ward).toBe(undefined);
            expect(this.bumpsy.damage).toBe(0);
            expect(this.etherSpider.damage).toBe(0);
        });

        it('should be able to target friendly creatures', function () {
            this.player1.play(this.geneticBlast);
            this.player1.clickCard(this.pelf);
            expect(this.player1).isReadyToTakeAction();
            expect(this.pelf.damage).toBe(2);
            expect(this.pelf2.damage).toBe(2);
            expect(this.pelf3.damage).toBe(0);
            expect(this.pelf3.tokens.ward).toBe(undefined);
            expect(this.bumpsy.damage).toBe(0);
            expect(this.etherSpider.damage).toBe(0);
        });
    });
});
