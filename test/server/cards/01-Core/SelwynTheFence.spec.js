describe('Selwyn The Fence', function() {
    integration(function() {
        describe('Selwyn The Fence\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'shadows',
                        inPlay: ['selwyn-the-fence', 'bad-penny'],
                        hand: ['old-bruno']
                    },
                    player2: {
                        inPlay: ['urchin'],
                        amber: 3
                    }
                });
            });

            it('should move captured Aember to pool when reaping.', function() {
                this.player1.play(this.oldBruno);
                this.player1.reap(this.selwynTheFence);
                this.player1.clickCard(this.oldBruno);
                expect(this.oldBruno.tokens.amber).toBe(2);
                expect(this.player1.amber).toBe(2);
            });

            it('should move captured Aember to pool when fighting.', function() {
                this.player1.play(this.oldBruno);
                this.player1.fightWith(this.selwynTheFence, this.urchin);
                this.player1.clickCard(this.oldBruno);
                expect(this.oldBruno.tokens.amber).toBe(2);
                expect(this.player1.amber).toBe(1);
            });

            it('should not add Aember to pool when reaping if none is captured.', function() {
                this.player1.reap(this.selwynTheFence);
                this.player1.clickCard(this.badPenny);
                expect(this.player1.amber).toBe(1);
            });

            it('should not add Aember to pool when fighting if none is captured.', function() {
                this.player1.fightWith(this.selwynTheFence, this.urchin);
                this.player1.clickCard(this.badPenny);
                expect(this.player1.amber).toBe(0);
            });
        });
    });
});
