describe('Bypass Burglar', function () {
    describe("Bypass Burglar's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['exeldon-yash', 'bypass-burglar', 'krisper-ruld']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('grants steal/self-damage action to left neighbor when exhausted', function () {
            this.player1.reap(this.bypassBurglar);
            this.player1.useAction(this.exeldonYash);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.exeldonYash.damage).toBe(1);
            expect(this.bypassBurglar.damage).toBe(0);
            expect(this.krisperRuld.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('grants steal/self-damage action to right neighbor when exhausted', function () {
            this.player1.reap(this.bypassBurglar);
            this.player1.useAction(this.krisperRuld);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.krisperRuld.damage).toBe(0);
            expect(this.krisperRuld.armor).toBe(0);
            expect(this.bypassBurglar.damage).toBe(0);
            expect(this.exeldonYash.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not grant the action when ready', function () {
            this.player1.clickCard(this.exeldonYash);
            expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
            this.player1.clickPrompt('Cancel');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
