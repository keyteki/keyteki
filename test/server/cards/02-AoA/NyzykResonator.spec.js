describe('Nyzyk Resonator', function () {
    describe("Nyzyk Resonator's persistent effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['storm-crawler', 'nyzyk-resonator', 'mindworm', 'lamindra']
                },
                player2: {}
            });
        });

        it('only counts neighbors and does not affect its own controller key cost', function () {
            this.player1.moveCard(this.stormCrawler, 'discard');
            this.player1.moveCard(this.mindworm, 'discard');
            this.player1.moveCard(this.lamindra, 'discard');
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('increases the opponent key cost by 2 for one neighbor and leaves own key cost unchanged', function () {
            this.player1.moveCard(this.mindworm, 'discard');
            this.player1.moveCard(this.lamindra, 'discard');
            expect(this.player2.player.getCurrentKeyCost()).toBe(8);
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('increases the opponent key cost by 4 for two neighbors and does not count a non-neighbor creature in play', function () {
            expect(this.player2.player.getCurrentKeyCost()).toBe(10);
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
