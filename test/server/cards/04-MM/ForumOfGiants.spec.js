describe('Forum Of Giants', function () {
    integration(function () {
        describe("Forum of Giant's ability", function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'saurian',
                        inPlay: ['forum-of-giants', 'stealer-of-souls', 'screaming-cave']
                    },
                    player2: {
                        amber: 4,
                        inPlay: ['batdrone'],
                        hand: ['troll']
                    }
                });
            });

            it('should give player 1 1 amber at the start of their turn if they have the most powerful creature', function () {
                this.player1.endTurn();

                this.player2.clickPrompt('brobnar');
                this.player2.endTurn();

                this.player1.clickPrompt('saurian');
                expect(this.player1.amber).toBe(1);
                expect(this.player2.amber).toBe(4);
            });

            it('should give player 2 1 amber at the start of their turn if they have the most powerful creature', function () {
                this.player1.endTurn();

                this.player2.clickPrompt('brobnar');
                this.player2.play(this.troll);
                this.player2.endTurn();

                this.player1.clickPrompt('saurian');
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(5);
            });

            it('if there are not creatures, active player gets 1A', function () {
                this.player2.player.moveCard(this.batdrone, 'discard');
                this.player1.player.moveCard(this.stealerOfSouls, 'discard');

                this.player1.endTurn();

                this.player2.clickPrompt('brobnar');
                this.player2.endTurn();

                this.player1.clickPrompt('saurian');
                expect(this.player1.amber).toBe(1);
                expect(this.player2.amber).toBe(4);
            });
        });
    });
});
