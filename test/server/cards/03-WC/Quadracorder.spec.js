describe('Quadracorder', function() {
    integration(function() {
        describe('Quadracorder\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 6,
                        house: 'staralliance',
                        hand: ['quadracorder'],
                        inPlay: ['lieutenant-khrkhar']
                    },
                    player2: {
                        amber: 6,
                        hand: ['remote-access']
                    }
                });
            });

            it('should increase key cost by [1] when it is attached to a creature', function() {
                this.player1.playUpgrade(this.quadracorder, this.lieutenantKhrkhar);
                this.player1.endTurn();
                expect(this.player2.player.keys).toBe(0);
                expect(this.player2.player.amber).toBe(6);
            });
        });
        describe('Quadracorder\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 6,
                        house: 'staralliance',
                        hand: ['quadracorder'],
                        inPlay: ['lieutenant-khrkhar','mother']
                    },
                    player2: {
                        amber: 7,
                        hand: ['remote-access']
                    }
                });
            });

            it('should increase key cost by [2] when it is attached to a creature', function() {
                this.player1.playUpgrade(this.quadracorder, this.lieutenantKhrkhar);
                this.player1.endTurn();
                expect(this.player2.player.keys).toBe(0);
                expect(this.player2.player.amber).toBe(7);
            });
        });
        describe('Quadracorder\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 6,
                        house: 'staralliance',
                        hand: ['quadracorder'],
                        inPlay: ['lieutenant-khrkhar', 'mother', 'rustgnawer']
                    },
                    player2: {
                        amber: 8,
                        hand: ['remote-access']
                    }
                });
            });

            it('should increase key cost by [3] when it is attached to a creature', function() {
                this.player1.playUpgrade(this.quadracorder, this.lieutenantKhrkhar);
                this.player1.endTurn();
                expect(this.player2.player.keys).toBe(0);
                expect(this.player2.player.amber).toBe(8);
            });
        });
    });
});
