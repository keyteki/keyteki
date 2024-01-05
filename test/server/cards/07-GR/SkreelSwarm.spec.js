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
            expect(this.faustTheGreat.tokens.damage).toBe(1);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.flaxia.tokens.damage).toBe(undefined);
        });

        it('can archive itself on scrap', function () {
            this.player1.clickCard(this.skreelSwarm);
            this.player1.clickPrompt('Discard this card');
            expect(this.skreelSwarm.location).toBe('archives');
        });
    });
});
