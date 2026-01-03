describe('Maqui Expedition', function () {
    describe("Maqui Expedition's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['maqui-expedition'],
                    inPlay: ['umbra', 'old-bruno']
                },
                player2: {
                    inPlay: ['troll', 'gub', 'krump']
                }
            });
        });

        it('should take control of an enemy flank creautre', function () {
            this.player1.play(this.maquiExpedition);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.oldBruno);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay[2]).toBe(this.troll);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
