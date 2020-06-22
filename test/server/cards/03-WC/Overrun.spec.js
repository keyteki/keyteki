describe('Overrun', function () {
    describe('Overruns Ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'brobnar',
                    hand: ['overrun'],
                    inPlay: ['brammo', 'ganger-chieftain', 'foozle', 'culf-the-quiet']
                },
                player2: {
                    amber: 3,
                    inPlay: ['silvertooth', 'bad-penny', 'umbra', 'redlock']
                }
            });
        });
        it('should cause the opponent to lose 2A if 3 or more enemy creatures die in a fight this round.', function () {
            this.player1.fightWith(this.brammo, this.silvertooth);
            this.player1.fightWith(this.gangerChieftain, this.badPenny);
            this.player1.fightWith(this.foozle, this.umbra);
            this.player1.play(this.overrun);
            expect(this.player2.amber).toBe(1);
        });
        it('should NOT cause the opponent to lose 2A if less than 3 enemy creatures die in a fight this round.', function () {
            this.player1.fightWith(this.brammo, this.silvertooth);
            this.player1.fightWith(this.gangerChieftain, this.badPenny);
            this.player1.play(this.overrun);
            expect(this.player2.amber).toBe(3);
        });
    });
});
