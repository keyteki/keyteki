describe('Icon of Favor', function() {
    integration(function() {
        describe('Icon of Favor\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-youth'],
                        hand: ['icon-of-favor']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.moto = this.player1.findCardByName('moto-youth');
                this.icon = this.player1.findCardByName('icon-of-favor');
                this.player1.playAttachment(this.icon, this.moto);
                this.noMoreActions();
            });

            it('should give attached character +1 glory when you have Imperial Favor', function() {
                let glory = this.moto.glory;
                this.player1.player.imperialFavor = 'political';
                this.game.checkGameState(true);
                expect(this.moto.glory).toBe(glory + 1);
                this.player1.player.imperialFavor = '';
                this.game.checkGameState(true);
                expect(this.moto.glory).toBe(glory);
            });

            it('should honor after winning Fire conflict', function() {
                expect(this.moto.isHonored).toBe(false);
                this.initiateConflict({
                    ring: 'fire',
                    attackers: [this.moto]
                });
                this.player2.clickPrompt('Done');
                this.player2.pass();
                this.player1.pass();
                this.player1.clickCard(this.icon);
                expect(this.moto.isHonored).toBe(true);
            });

            function testNonFireConflicts(conflictType) {
                it('should not honor after winning a ' + conflictType + ' conflict',
                    function() {
                        expect(this.moto.isHonored).toBe(false);
                        this.initiateConflict({
                            ring: conflictType,
                            attackers: [this.moto]
                        });
                        this.player2.clickPrompt('Done');
                        this.player2.pass();
                        this.player1.pass();
                        this.player1.clickCard(this.icon);
                        expect(this.moto.isHonored).toBe(false);
                    }
                );
            }

            for(let conflictType of ['air', 'earth', 'water', 'void']) {
                testNonFireConflicts(conflictType);
            }
        });
    });
});
