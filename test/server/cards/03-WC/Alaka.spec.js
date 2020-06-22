describe('Alaka(WC)', function () {
    describe('Alaka constant ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['alaka'],
                    inPlay: ['mugwump']
                },
                player2: {
                    inPlay: ['nexus']
                }
            });
        });

        it('enters ready if a fight happened', function () {
            this.player1.fightWith(this.mugwump, this.nexus);
            this.player1.play(this.alaka);
            expect(this.alaka.exhausted).toBe(false);
        });
        it('enters exhausted if a fight didnt happen', function () {
            this.player1.play(this.alaka);
            expect(this.alaka.exhausted).toBe(true);
        });
        it('enters exhausted if the last fight was a turn ago', function () {
            this.player1.fightWith(this.mugwump, this.nexus);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.alaka);
            expect(this.alaka.exhausted).toBe(true);
        });
    });
});
