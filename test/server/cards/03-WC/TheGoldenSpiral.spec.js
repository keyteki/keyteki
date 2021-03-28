describe('The Golden Spiral', function () {
    describe("The Golden Spiral's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: [
                        'abond-the-armorsmith',
                        'flaxia',
                        'brutodon-auxiliary',
                        'the-golden-spiral'
                    ]
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('Exalt, ready and reap with an exhausted friendly creature', function () {
            this.player1.reap(this.brutodonAuxiliary);
            this.player1.useAction(this.theGoldenSpiral);

            expect(this.player1).toBeAbleToSelect(this.brutodonAuxiliary);
            expect(this.player1).toBeAbleToSelect(this.abondTheArmorsmith);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);

            this.player1.clickCard(this.brutodonAuxiliary);
            this.player1.clickPrompt('Reap with this creature');

            expect(this.brutodonAuxiliary.tokens.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
        });

        it('Exalt and reap with a ready friendly creature', function () {
            this.player1.useAction(this.theGoldenSpiral);

            expect(this.player1).toBeAbleToSelect(this.brutodonAuxiliary);
            expect(this.player1).toBeAbleToSelect(this.abondTheArmorsmith);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);

            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Reap with this creature');

            expect(this.flaxia.tokens.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
        });

        it('Exalt, ready and fight with an exhausted friendly creature', function () {
            this.player1.reap(this.brutodonAuxiliary);
            this.player1.useAction(this.theGoldenSpiral);

            expect(this.player1).toBeAbleToSelect(this.brutodonAuxiliary);
            expect(this.player1).toBeAbleToSelect(this.abondTheArmorsmith);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);

            this.player1.clickCard(this.brutodonAuxiliary);
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.lamindra);

            expect(this.brutodonAuxiliary.tokens.amber).toBe(1);
        });

        it('Exalt and fight with a ready friendly creature', function () {
            this.player1.useAction(this.theGoldenSpiral);

            expect(this.player1).toBeAbleToSelect(this.brutodonAuxiliary);
            expect(this.player1).toBeAbleToSelect(this.abondTheArmorsmith);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);

            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.lamindra);

            expect(this.flaxia.tokens.amber).toBe(1);
        });

        it('Exalt, ready and use an action of an exhausted friendly creature', function () {
            this.abondTheArmorsmith.exhausted = true;
            this.player1.useAction(this.theGoldenSpiral);

            expect(this.player1).toBeAbleToSelect(this.brutodonAuxiliary);
            expect(this.player1).toBeAbleToSelect(this.abondTheArmorsmith);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);

            this.player1.clickCard(this.abondTheArmorsmith);
            this.player1.clickPrompt("Use this card's Action ability");

            expect(this.abondTheArmorsmith.tokens.amber).toBe(1);
        });

        it('Exalt, ready and use an action of a ready friendly creature', function () {
            this.player1.useAction(this.theGoldenSpiral);

            expect(this.player1).toBeAbleToSelect(this.brutodonAuxiliary);
            expect(this.player1).toBeAbleToSelect(this.abondTheArmorsmith);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);

            this.player1.clickCard(this.abondTheArmorsmith);
            this.player1.clickPrompt("Use this card's Action ability");

            expect(this.abondTheArmorsmith.tokens.amber).toBe(1);
        });
    });
});
