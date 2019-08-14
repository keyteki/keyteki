describe('MaruckTheMarked', function() {
    integration(function() {
        describe('MaruckTheMarked\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        amber: 2,
                        inPlay: ['professor-sutterkin', 'zyx-researcher'],
                        hand: []
                    },
                    player2: {
                        amber: 0,
                        inPlay: ['maruck-the-marked'],
                        hand: ['bulwark', 'red-hot-armor']
                    }
                });
            });

            it('captures 1 amber if 1 damage is prevented', function() {
                this.player1.fightWith(this.professorSutterkin, this.maruckTheMarked);
                expect(this.player1.player.amber).toBe(1);
            });

            it('does not capture amber after armor is removed', function() {
                this.player1.fightWith(this.professorSutterkin, this.maruckTheMarked);
                this.player1.fightWith(this.zyxResearcher, this.maruckTheMarked);
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

            it('captures 1 amber if 1 damage is prevented while he fights', function() {
                this.player1.endTurn();

                this.player2.clickPrompt('sanctum');
                this.player2.fightWith(this.maruckTheMarked, this.professorSutterkin);

                expect(this.player1.player.amber).toBe(1);
            });

            it('does not capture amber when Redhot Armor is played', function () {
                this.player1.endTurn();

                this.player2.clickPrompt('dis');
                this.player2.play(this.redHotArmor);

                expect(this.maruckTheMarked.armor).toBe(0);
                expect(this.maruckTheMarked.armorUsed).toBe(0);

                expect(this.maruckTheMarked.hasToken('damage')).toBe(true);
                expect(this.maruckTheMarked.hasToken('amber')).toBe(false);
            });
        });
    });
});
