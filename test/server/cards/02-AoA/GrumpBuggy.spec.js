describe('Grump Buggy', function () {
    describe("Grump Buggy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['grump-buggy', 'troll', 'bumpsy', 'smaaash', 'brammo']
                },
                player2: {
                    inPlay: ['baron-mengevin', 'berinon', 'angry-mob']
                }
            });
        });

        it('should increase opponent key cost for each friendly creature with power 5+', function () {
            expect(this.player1.player.getCurrentKeyCost()).toBe(8);
            expect(this.player2.player.getCurrentKeyCost()).toBe(9);

            this.player1.moveCard(this.troll, 'discard');
            expect(this.player1.player.getCurrentKeyCost()).toBe(8);
            expect(this.player2.player.getCurrentKeyCost()).toBe(8);

            this.player2.moveCard(this.baronMengevin, 'discard');
            expect(this.player1.player.getCurrentKeyCost()).toBe(7);
            expect(this.player2.player.getCurrentKeyCost()).toBe(8);

            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            expect(this.player1.player.getCurrentKeyCost()).toBe(7);
            expect(this.player2.player.getCurrentKeyCost()).toBe(8);

            this.player1.moveCard(this.bumpsy, 'discard');
            expect(this.player1.player.getCurrentKeyCost()).toBe(7);
            expect(this.player2.player.getCurrentKeyCost()).toBe(7);

            this.player2.moveCard(this.berinon, 'discard');
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(7);

            this.brammo.powerCounters = 1;
            this.angryMob.powerCounters = 1;
            expect(this.brammo.power).toBe(5);
            expect(this.angryMob.power).toBe(5);
            expect(this.player1.player.getCurrentKeyCost()).toBe(7);
            expect(this.player2.player.getCurrentKeyCost()).toBe(8);

            expect(this.player2).isReadyToTakeAction();
        });
    });
});
