describe('Replicator', function() {
    integration(function() {
        describe('Replicator\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        amber: 2,
                        inPlay: ['replicator', 'gamgee', 'titan-mechanic']
                    },
                    player2: {
                        amber: 5,
                        inPlay: ['foozle', 'bingle-bangbang']
                    }
                });
            });

            it('should use Gamgee\'s reap effect', function() {
                this.player1.reap(this.replicator);
                this.player1.clickCard(this.gamgee);
                expect(this.player1.player.amber).toBe(4);
                expect(this.player2.player.amber).toBe(4);
            });

            it('should use Foozle\'s reap effect', function() {
                this.player1.fightWith(this.titanMechanic, this.bingleBangbang);
                this.player1.reap(this.replicator);
                this.player1.clickCard(this.foozle);
                expect(this.player1.player.amber).toBe(4);
                expect(this.player2.player.amber).toBe(5);
            });

            xit('should fail Foozle\'s reap effect\'s condition', function() {
                this.player1.reap(this.replicator);
                this.player1.clickCard(this.foozle);
                expect(this.player1.player.amber).toBe(3);
                expect(this.player2.player.amber).toBe(5);
            });
        });
    });
});
