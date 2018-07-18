describe('Disguised Protector', function() {
    integration(function() {
        describe('Disguised Protector\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['disguised-protector', 'adept-of-shadows']
                    },
                    player2: {
                        inPlay: ['intimidating-hida']
                    }
                });
                this.player1.player.showBid = 5;
                this.player2.player.showBid = 1;
                this.noMoreActions();
            });

            it('should add each players bid to their conflict skill modifier when disguised protector is particiating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['disguised-protector', 'adept-of-shadows'],
                    defenders: ['intimidating-hida']
                });
                this.player2.pass();
                this.player1.clickCard('disguised-protector');
                expect(this.player1.player.skillModifier).toBe(this.player1.player.showBid);
                expect(this.player2.player.skillModifier).toBe(this.player2.player.showBid);
            });

            it('should not add each players bid to their conflict skill modifier when disguised protector is not particiating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['adept-of-shadows'],
                    defenders: ['intimidating-hida']
                });
                this.player2.pass();
                this.player1.clickCard('disguised-protector');
                expect(this.player1.player.skillModifier).toBe(0);
                expect(this.player2.player.skillModifier).toBe(0);
            });
        });
    });
});
