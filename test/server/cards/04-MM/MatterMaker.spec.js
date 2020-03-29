describe('matter-maker', function() {
    integration(function() {
        describe('Matter Makers\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'staralliance',
                        inPlay: ['troll'],
                        hand: ['camouflage','matter-maker','stunner']
                    },
                    player2: {
                        amber: 1,
                        inPlay: ['umbra']
                    }
                });
            });

            it('should enable playing matter maker should enable the play of camouflage and stunner', function() {
                this.player1.play(this.matterMaker);
                this.player1.playUpgrade(this.camouflage, this.troll);
                this.player1.playUpgrade(this.stunner, this.troll);
                expect(this.troll.upgrades).toContain(this.camouflage);
                expect(this.troll.upgrades).toContain(this.stunner);
            });

            it('show allow playing staralliance upgrades on non-starliance turns', function() {
                this.player1.play(this.matterMaker);
                this.player1.endTurn();

                this.player2.clickPrompt('shadows');
                this.player2.endTurn();

                this.player1.clickPrompt('untamed');
                this.player1.playUpgrade(this.camouflage, this.troll);
                this.player1.playUpgrade(this.stunner, this.troll);
                expect(this.troll.upgrades).toContain(this.camouflage);
                expect(this.troll.upgrades).toContain(this.stunner);
            });
        });
    });
});
