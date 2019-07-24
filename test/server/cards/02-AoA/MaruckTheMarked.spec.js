describe('MaruckTheMarked', function() {
    integration(function() {
        describe('MaruckTheMarked\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        amber: 2,
                        inPlay: ['professor-sutterkin'],
                        hand: []
                    },
                    player2: {
                        amber: 0,
                        inPlay: ['maruck-the-marked'],
                        hand: ['bulwark']
                    }
                });
            });

            it('captures 1 amber if 1 damage is prevented', function() {
                this.player1.fightWith(this.professorSutterkin, this.maruckTheMarked);
                expect(this.player1.player.amber).toBe(1);
            });

            it('captures 2 damage if 2 damage is prevented', function() {
                this.player1.endTurn();

                this.player2.clickPrompt('sanctum');
                this.player2.play(this.bulwark);
                this.player2.endTurn();

                this.player1.clickPrompt('logos');
                this.player1.fightWith(this.professorSutterkin, this.maruckTheMarked);

                expect(this.player1.player.amber).toBe(0);
            });
        });
    });
});
