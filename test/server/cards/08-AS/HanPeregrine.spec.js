describe('Han Peregrine', function () {
    describe("Han Peregrine's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['han-peregrine', 'troll', 'pelf']
                },
                player2: {
                    inPlay: ['umbra', 'charette']
                }
            });

            this.troll.tokens.damage = 3;
            this.charette.tokens.damage = 1;
        });

        it('should be optional', function () {
            this.player1.reap(this.hanPeregrine);
            this.player1.clickPrompt('Done');
            expect(this.hanPeregrine.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should only work for damaged creatures', function () {
            this.player1.reap(this.hanPeregrine);
            this.player1.clickCard(this.hanPeregrine);
            expect(this.hanPeregrine.amber).toBe(1);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Right');
            expect(this.troll.tokens.damage).toBe(undefined);
            expect(this.player1.player.creaturesInPlay[2]).toBe(this.troll);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should only work for enemy creatures', function () {
            this.player1.reap(this.hanPeregrine);
            this.player1.clickCard(this.hanPeregrine);
            this.player1.clickCard(this.charette);
            this.player1.clickPrompt('Left');
            expect(this.charette.tokens.damage).toBe(undefined);
            expect(this.player2.player.creaturesInPlay[0]).toBe(this.charette);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
