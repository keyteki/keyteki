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

        it('should deal 1 damage to a friendly creature and 1 to an enemy creature', function () {
            this.player1.play(this.tradeBlows);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.yurk);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.searine);
            this.player1.clickCard(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.searine);
            this.player1.clickCard(this.flaxia);
            expect(this.emberImp.damage).toBe(1);
            expect(this.flaxia.damage).toBe(1);
            this.player1.clickPrompt('No');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not offer repeat if enemy creature is destroyed', function () {
            this.flaxia.damage = 3;
            this.player1.play(this.tradeBlows);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should repeat if enemy creature survives and player chooses to continue', function () {
            this.player1.play(this.tradeBlows);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.flaxia);
            expect(this.emberImp.damage).toBe(1);
            expect(this.flaxia.damage).toBe(1);
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.yurk);
            this.player1.clickCard(this.searine);
            expect(this.yurk.damage).toBe(1);
            expect(this.searine.damage).toBe(1);
            this.player1.clickPrompt('No');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should deal damage to friendly creature but fizzle with no enemy creatures', function () {
            this.player2.moveCard(this.flaxia, 'discard');
            this.player2.moveCard(this.searine, 'discard');
            this.player1.play(this.tradeBlows);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should repeatedly damage enemy creatures with no friendly creatures', function () {
            this.player1.moveCard(this.emberImp, 'discard');
            this.player1.moveCard(this.yurk, 'discard');
            this.flaxia.damage = 3;
            this.player1.play(this.tradeBlows);
            this.player1.clickCard(this.searine);
            expect(this.searine.damage).toBe(1);
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.searine);
            expect(this.searine.damage).toBe(2);
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.searine);
            expect(this.searine.damage).toBe(3);
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            expect(this.searine.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should repeat if enemy creature was warded', function () {
            this.flaxia.ward();
            this.player1.play(this.tradeBlows);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.flaxia);
            expect(this.emberImp.damage).toBe(1);
            expect(this.flaxia.warded).toBe(false);
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.yurk);
            this.player1.clickCard(this.searine);
            expect(this.yurk.damage).toBe(1);
            expect(this.searine.damage).toBe(1);
            this.player1.clickPrompt('No');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
