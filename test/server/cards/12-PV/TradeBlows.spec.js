describe('Trade Blows', function () {
    describe("Trade Blows's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    hand: ['trade-blows'],
                    inPlay: ['ember-imp', 'yurk']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia', 'searine']
                }
            });
        });

        it('should deal 1 damage to an enemy creature', function () {
            this.player1.play(this.tradeBlows);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.searine);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.yurk);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.tokens.damage).toBe(1);
            this.player1.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not repeat if enemy creature is destroyed', function () {
            this.flaxia.tokens.damage = 3;
            this.player1.play(this.tradeBlows);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should repeat if enemy creature survives and player chooses to damage friendly creature', function () {
            this.player1.play(this.tradeBlows);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.tokens.damage).toBe(1);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.tokens.damage).toBe(1);
            this.player1.clickCard(this.searine);
            expect(this.searine.tokens.damage).toBe(1);
            this.player1.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should repeat if enemy creature was warded', function () {
            this.flaxia.ward();
            this.player1.play(this.tradeBlows);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.warded).toBe(false);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.tokens.damage).toBe(1);
            this.player1.clickCard(this.searine);
            expect(this.searine.tokens.damage).toBe(1);
            this.player1.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
