describe('Hologrammophone', function () {
    describe("Hologrammophone's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['flaxia', 'troll', 'the-feathered-shaman', 'hologrammophone']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });

            expect(this.flaxia.warded).toBe(false);
            expect(this.troll.warded).toBe(false);
            expect(this.theFeatheredShaman.warded).toBe(false);
            expect(this.lamindra.warded).toBe(false);
        });

        it('Ward a friendly creature', function () {
            this.player1.clickCard(this.hologrammophone);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Hologrammophone');

            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.theFeatheredShaman);

            this.player1.clickCard(this.theFeatheredShaman);

            expect(this.theFeatheredShaman.warded).toBe(true);
            expect(this.flaxia.warded).toBe(false);
            expect(this.troll.warded).toBe(false);
            expect(this.lamindra.warded).toBe(false);
        });

        it('Ward an enemy creature', function () {
            this.player1.clickCard(this.hologrammophone);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Hologrammophone');

            expect(this.player1).toBeAbleToSelect(this.lamindra);

            this.player1.clickCard(this.lamindra);

            expect(this.lamindra.warded).toBe(true);
            expect(this.flaxia.warded).toBe(false);
            expect(this.troll.warded).toBe(false);
            expect(this.theFeatheredShaman.warded).toBe(false);
        });
    });
});
