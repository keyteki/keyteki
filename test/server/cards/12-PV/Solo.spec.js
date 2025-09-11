describe('Solo', function () {
    describe("Solo's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'dis',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    inPlay: ['solo', 'ember-imp']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'hunting-witch']
                }
            });
        });

        it('should get +20 power and gain amber after fight when alone', function () {
            this.player1.fightWith(this.emberImp, this.mightyTiger);
            expect(this.emberImp.location).toBe('discard');
            expect(this.solo.power).toBe(25);
            this.player1.fightWith(this.solo, this.huntingWitch);
            expect(this.player1.amber).toBe(3);
        });

        it('should not get bonus when other friendly creatures are in play', function () {
            expect(this.solo.power).toBe(5);
            this.player1.fightWith(this.solo, this.mightyTiger);
            expect(this.player1.amber).toBe(0);
        });

        it('should destroy all creatures when fate is triggered', function () {
            this.player1.moveCard(this.solo, 'hand');
            this.player1.activateProphecy(this.overreach, this.solo);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.mightyTiger);
            expect(this.solo.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
            expect(this.mightyTiger.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
