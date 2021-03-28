describe('Overrun', function () {
    describe('Overruns Ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'brobnar',
                    hand: ['overrun', 'ballcano'],
                    inPlay: ['brammo', 'ganger-chieftain', 'foozle', 'culf-the-quiet']
                },
                player2: {
                    amber: 5,
                    inPlay: ['silvertooth', 'bad-penny', 'umbra'],
                    hand: ['lamindra']
                }
            });
        });

        it('should cause the opponent to lose 2A if 3 or more enemy creatures die in a fight this round.', function () {
            this.player1.fightWith(this.brammo, this.silvertooth);
            this.player1.fightWith(this.gangerChieftain, this.badPenny);
            this.player1.fightWith(this.foozle, this.umbra);
            this.player1.play(this.overrun);
            expect(this.player2.amber).toBe(3);
        });

        it('should only count creatures destroyed in the current round.', function () {
            this.player1.fightWith(this.brammo, this.silvertooth);
            this.player1.fightWith(this.gangerChieftain, this.badPenny);
            this.player1.fightWith(this.foozle, this.umbra);
            this.player1.play(this.overrun);
            expect(this.player2.amber).toBe(3);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.lamindra);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.moveCard(this.overrun, 'hand');
            this.player1.play(this.overrun);
            this.player1.play(this.ballcano);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
        });

        it('should NOT cause the opponent to lose 2A if less than 3 enemy creatures die in a fight this round.', function () {
            this.player1.fightWith(this.brammo, this.silvertooth);
            this.player1.fightWith(this.gangerChieftain, this.badPenny);
            this.player1.play(this.overrun);
            expect(this.player2.amber).toBe(5);
        });

        it('should NOT cause the opponent to lose 2A if creatures are warded.', function () {
            this.silvertooth.ward();
            this.umbra.ward();
            this.badPenny.ward();
            this.player1.play(this.ballcano);
            expect(this.silvertooth.location).toBe('play area');
            expect(this.umbra.location).toBe('play area');
            expect(this.badPenny.location).toBe('play area');
            expect(this.silvertooth.tokens.ward).toBeUndefined();
            expect(this.badPenny.tokens.ward).toBeUndefined();
            expect(this.umbra.tokens.ward).toBeUndefined();
            this.player1.play(this.overrun);
            expect(this.player2.amber).toBe(5);
        });
    });
});
