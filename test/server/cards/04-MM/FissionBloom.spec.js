describe('Fission Bloom', function () {
    describe("Fission Bloom's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['fission-bloom'],
                    archives: ['helper-bot'],
                    hand: [
                        'timetraveller',
                        'medic-ingram',
                        'mab-the-mad',
                        'neuro-syphon',
                        'ultra-gravitron',
                        'ultra-gravitron2'
                    ]
                },
                player2: {
                    inPlay: ['batdrone', 'bot-bookton']
                }
            });

            this.player1.play(this.ultraGravitron);
            this.ultraGravitron.ready();
            this.player1.useAction(this.fissionBloom);
        });

        it('resolve the bonus icons of the next card played an additional time', function () {
            this.player1.play(this.neuroSyphon); // 1 + 1 amber
            expect(this.player1.amber).toBe(2);
        });

        it('resolve the bonus icons of the next card played an additional time, even if the card returns to hand', function () {
            this.player1.play(this.neuroSyphon); // 1 + 1 amber
            this.player1.moveCard(this.neuroSyphon, 'hand');
            this.player1.play(this.neuroSyphon); // 1 amber
            expect(this.player1.amber).toBe(3);
        });

        it('resolve the bonus icons of the next card played an additional time, even if the bonus of that card is triggered by another effect', function () {
            this.player1.play(this.timetraveller); // 1 + 1 amber
            this.player1.reap(this.ultraGravitron); // 1 amber
            this.player1.clickCard(this.helperBot);
            this.player1.clickCard(this.timetraveller); // 1 amber
            expect(this.timetraveller.location).toBe('purged');
            expect(this.player1.amber).toBe(4);
        });
    });
});
