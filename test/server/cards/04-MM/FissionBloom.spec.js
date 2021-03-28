describe('Fission Bloom', function () {
    describe("Fission Bloom's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    inPlay: ['fission-bloom'],
                    hand: ['medic-ingram', 'mab-the-mad', 'neuro-syphon']
                },
                player2: {
                    inPlay: ['batdrone', 'bot-bookton']
                }
            });
        });

        it('resolve the bonus icons of the next card played an additional time', function () {
            this.player1.useAction(this.fissionBloom);
            this.player1.play(this.neuroSyphon);

            expect(this.player1.amber).toBe(3);
        });
    });
});
