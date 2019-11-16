describe('Quadracorder', function() {
    integration(function() {
        describe('Quadracorder\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 6,
                        house: 'staralliance',
                        hand: ['quadracorder', 'mother', 'rustgnawer'],
                        inPlay: ['lieutenant-khrkhar']
                    },
                    player2: {
                        amber: 6,
                        hand: ['remote-access'],
                        inPlay: ['bad-penny']
                    }
                });
            });

            it('should increase key cost by [1] when it is attached to a creature', function() {
                this.player1.playUpgrade(this.quadracorder, this.lieutenantKhrkhar);
                this.player1.endTurn();
                expect(this.player2.player.getForgedKeys()).toBe(0);
                expect(this.player2.player.amber).toBe(6);
            });

            it('should increase key cost by [2] when it is attached to a creature', function() {
                this.player1.moveCard(this.mother, 'play area');
                this.player2.amber = 7;
                this.player1.playUpgrade(this.quadracorder, this.lieutenantKhrkhar);
                this.player1.endTurn();
                expect(this.player2.player.getForgedKeys()).toBe(0);
                expect(this.player2.player.amber).toBe(7);
            });

            it('should increase key cost by [3] when it is attached to a creature', function() {
                this.player1.moveCard(this.mother, 'play area');
                this.player1.moveCard(this.rustgnawer, 'play area');
                this.player2.amber = 8;
                this.player1.playUpgrade(this.quadracorder, this.lieutenantKhrkhar);
                this.player1.endTurn();
                expect(this.player2.player.getForgedKeys()).toBe(0);
                expect(this.player2.player.amber).toBe(8);
            });

            it('should increase key cost by [3] when it is attached to an enemy creature', function() {
                this.player1.moveCard(this.mother, 'play area');
                this.player1.moveCard(this.rustgnawer, 'play area');
                this.player2.moveCard(this.badPenny, 'play area');
                this.player2.amber = 8;
                this.player1.playUpgrade(this.quadracorder, this.badPenny);
                this.player1.endTurn();
                expect(this.player2.player.getForgedKeys()).toBe(0);
                expect(this.player2.player.amber).toBe(8);
            });
            it('should increase key cost by [3] when it is attached to an enemy creature, but not to controller', function() {
                this.player1.moveCard(this.mother, 'play area');
                this.player1.moveCard(this.rustgnawer, 'play area');
                this.player2.moveCard(this.badPenny, 'play area');
                this.player1.amber = 6;
                this.player2.amber = 8;
                this.player1.playUpgrade(this.quadracorder, this.badPenny);
                this.player1.endTurn();
                expect(this.player2.player.getForgedKeys()).toBe(0);
                expect(this.player2.player.amber).toBe(8);
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();
                this.player1.forgeKey('Red');
                expect(this.player1.player.keys.red).toBe(true);
                expect(this.player1.player.keys.blue).toBe(false);
                expect(this.player1.player.keys.yellow).toBe(false);
                expect(this.player1.amber).toBe(0);
            });
        });
    });
});
