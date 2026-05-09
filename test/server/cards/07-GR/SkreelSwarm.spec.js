describe('Skreel Swarm', function () {
    describe("Skreel Swarm's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['skreel-swarm'],
                    inPlay: ['flaxia']
                },
                player2: {
                    inPlay: ['faust-the-great', 'dust-pixie']
                }
            });
        });

        it('deals 1D to each enemy creature', function () {
            this.player1.play(this.skreelSwarm);
            expect(this.faustTheGreat.damage).toBe(1);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.flaxia.damage).toBe(0);
        });

        it('may archive itself on scrap', function () {
            this.player1.scrap(this.skreelSwarm);
            this.player1.clickCard(this.skreelSwarm);
            expect(this.skreelSwarm.location).toBe('archives');
        });

        it('may not archive itself on scrap', function () {
            this.player1.scrap(this.skreelSwarm);
            this.player1.clickPrompt('Done');
            expect(this.skreelSwarm.location).toBe('discard');
        });
    });
});
