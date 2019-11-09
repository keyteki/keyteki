describe('Shattered Throne', function() {
    integration(function() {
        describe('Shattered Throne Ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 3,
                        house: 'brobnar',
                        inPlay: ['brammo', 'ganger-chieftain', 'foozle', 'culf-the-quiet', 'shattered-throne']
                    },
                    player2: {
                        amber: 3,
                        inPlay: ['silvertooth', 'gamgee', 'krump']
                    }
                });
            });

            it('should capture an amber after fight and survive', function() {
                this.player1.fightWith(this.brammo, this.silvertooth);
                expect(this.brammo.amber).toBe(1);
                expect(this.silvertooth.amber).toBe(0);
                expect(this.player2.amber).toBe(2);
            });

            it('should capture an amber after fighting an elusive', function() {
                this.player1.fightWith(this.brammo, this.gamgee);
                expect(this.brammo.amber).toBe(1);
                expect(this.gamgee.amber).toBe(0);
                expect(this.player2.amber).toBe(2);
            });

            it('should also be applicable for opponent', function() {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.fightWith(this.gamgee, this.culfTheQuiet);
                expect(this.gamgee.amber).toBe(1);
                expect(this.culfTheQuiet.amber).toBe(0);
                expect(this.player1.amber).toBe(2);
            });
        });
    });
});
