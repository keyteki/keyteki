describe('Yxlyx Stimrager', function () {
    describe("Yxlyx Stimrager's fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['yxlyx-stimrager', 'storm-crawler']
                },
                player2: {
                    inPlay: ['troll', 'lamindra', 'bumpsy']
                }
            });
        });

        it('deals 2 damage to a chosen creature, moves it to a chosen flank, and does not damage any other creature', function () {
            this.player1.fightWith(this.yxlyxStimrager, this.lamindra);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.yxlyxStimrager);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Left');
            expect(this.bumpsy.damage).toBe(2);
            expect(this.troll.damage).toBe(0);
            expect(this.stormCrawler.damage).toBe(0);
            expect(this.bumpsy.isOnFlank()).toBe(true);
            expect(this.troll.isOnFlank()).toBe(false);
            expect(this.lamindra.isOnFlank()).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
