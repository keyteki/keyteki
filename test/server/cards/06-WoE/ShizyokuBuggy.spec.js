describe('Shĭzyokŭ Buggy', function () {
    describe("Shĭzyokŭ Buggy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'ekwidon',
                    token: 'warrior',
                    hand: ['pelf', 'antiquities-dealer', 'conductor-jărroyă'],
                    inPlay: ['shĭzyokŭ-buggy']
                }
            });
        });

        it('it should reveal and discard two cards if they share a house', function () {
            this.player1.useAction(this.shĭzyokŭBuggy);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.antiquitiesDealer);
            expect(this.player1).toBeAbleToSelect(this.conductorJărroyă);
            this.player1.clickCard(this.conductorJărroyă);
            this.player1.clickCard(this.antiquitiesDealer);
            this.player1.clickPrompt('Done');
            expect(this.conductorJărroyă.location).toBe('discard');
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('it should do nothing if the revealed cards do not share a house', function () {
            this.player1.useAction(this.shĭzyokŭBuggy);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.antiquitiesDealer);
            expect(this.player1).toBeAbleToSelect(this.conductorJărroyă);
            this.player1.clickCard(this.pelf);
            this.player1.clickCard(this.antiquitiesDealer);
            this.player1.clickPrompt('Done');
            expect(this.pelf.location).toBe('hand');
            expect(this.antiquitiesDealer.location).toBe('hand');
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
