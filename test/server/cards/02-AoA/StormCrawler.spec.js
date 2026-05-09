describe('Storm Crawler', function () {
    describe("Storm Crawler's fight damage limit and stun-on-enemy-reap", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['storm-crawler', 'umbra']
                },
                player2: {
                    inPlay: ['krump']
                }
            });
        });

        it('only deals 1 damage when fighting (limited fight damage)', function () {
            this.player1.fightWith(this.stormCrawler, this.krump);
            expect(this.krump.damage).toBe(1);
            expect(this.krump.location).toBe('play area');
            expect(this.stormCrawler.damage).toBe(5);
            expect(this.stormCrawler.armor).toBe(0);
            expect(this.stormCrawler.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('stuns an enemy creature after it reaps', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.krump.stunned).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not stun a friendly creature when it reaps', function () {
            this.player1.reap(this.stormCrawler);
            expect(this.stormCrawler.stunned).toBe(false);
            expect(this.umbra.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
