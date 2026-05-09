describe('Mars First', function () {
    describe("Mars First's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['mars-first'],
                    inPlay: ['xanthyx-harvester', 'storm-crawler', 'troll']
                },
                player2: {
                    inPlay: ['krump']
                }
            });
        });

        it('readies and uses a friendly Mars creature, allowing it to reap', function () {
            this.stormCrawler.exhaust();
            this.player1.play(this.marsFirst);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.xanthyxHarvester);
            expect(this.player1).toBeAbleToSelect(this.stormCrawler);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.stormCrawler);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.stormCrawler.exhausted).toBe(true);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
