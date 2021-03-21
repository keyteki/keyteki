describe('AvengingAura', function () {
    describe('in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bad-penny', 'helper-bot', 'urchin'],
                    hand: ['avenging-aura']
                },
                player2: {
                    inPlay: ['gub']
                }
            });
        });

        describe('when played with zero opponent forged keys', function () {
            beforeEach(function () {
                this.player1.play(this.avengingAura);
            });

            it('all friendly creatures get assault 3', function () {
                expect(this.badPenny.getKeywordValue('assault')).toBe(0);
                expect(this.helperBot.getKeywordValue('assault')).toBe(0);
                expect(this.urchin.getKeywordValue('assault')).toBe(0);
                expect(this.gub.getKeywordValue('assault')).toBe(0);
            });
        });

        describe('when played with 1 opponent forged keys', function () {
            beforeEach(function () {
                this.player2.player.keys['blue'] = true;
                this.player1.play(this.avengingAura);
            });

            it('all friendly creatures get assault 2', function () {
                expect(this.badPenny.getKeywordValue('assault')).toBe(1);
                expect(this.helperBot.getKeywordValue('assault')).toBe(1);
                expect(this.urchin.getKeywordValue('assault')).toBe(1);
                expect(this.gub.getKeywordValue('assault')).toBe(0);
            });
        });
    });
});
