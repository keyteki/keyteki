describe('Kaboom', function () {
    describe("Kaboom's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 1,
                    hand: ['kaboom'],
                    inPlay: ['flaxia', 'xanthyx-harvester', 'yxilo-bolter']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump', 'ether-spider', 'collector-worm']
                }
            });

            this.gub.ward();
            this.yxiloBolter.ward();
        });

        it('should archive mars cards, destroy non-mars cards and give 3 chains', function () {
            this.player1.play(this.kaboom);
            expect(this.flaxia.location).toBe('discard');
            expect(this.xanthyxHarvester.location).toBe('archives');
            expect(this.yxiloBolter.location).toBe('discard');
            expect(this.gub.location).toBe('play area');
            expect(this.gub.warded).toBe(false);
            expect(this.krump.location).toBe('discard');
            expect(this.etherSpider.location).toBe('archives');
            expect(this.collectorWorm.location).toBe('archives');

            expect(this.player1.player.archives).toContain(this.xanthyxHarvester);
            expect(this.player2.player.archives).toContain(this.etherSpider);
            expect(this.player2.player.archives).toContain(this.collectorWorm);

            expect(this.player1.chains).toBe(3);
            this.player1.endTurn();
        });
    });
});
