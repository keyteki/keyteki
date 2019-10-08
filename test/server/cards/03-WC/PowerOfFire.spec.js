describe('PowerOfFire(WC)', function() {
    integration(function() {
        describe('PowerOfFire action', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 8,
                        house: 'brobnar',
                        hand: ['power-of-fire'],
                        inPlay: ['troll','barrister-joya']
                    },
                    player2: {
                        amber: 7
                    }
                });
            });

            it('makes players lose half of troll\'s power == 4', function() {
                this.player1.play(this.powerOfFire);
                this.player1.clickCard(this.troll);
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(3);
                expect(this.player1.chains).toBe(1);
                expect(this.player2.chains).toBe(0);
                expect(this).toHaveRecentChatMessage('player1 uses Power of Fire to sacrifice Troll and cause each player to lose 4 aember; player1 gains 1 chain');
            });
            it('makes players lose half of barrister\'s power == 2', function() {
                this.player1.play(this.powerOfFire);
                this.player1.clickCard(this.barristerJoya);
                expect(this.player1.amber).toBe(6);
                expect(this.player2.amber).toBe(5);
                expect(this.player1.chains).toBe(1);
                expect(this.player2.chains).toBe(0);
            });
        });
    });
});
