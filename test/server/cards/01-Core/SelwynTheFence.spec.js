describe('Selwyn The Fence', function () {
    describe("Selwyn The Fence's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['selwyn-the-fence'],
                    hand: ['old-bruno']
                },
                player2: {
                    inPlay: ['urchin'],
                    amber: 3
                }
            });
        });

        it('should move captured Amber to pool when reaping.', function () {
            this.player1.play(this.oldBruno);
            this.player1.reap(this.selwynTheFence);
            expect(this.player1).toHavePrompt('Choose a captured amber to move to your pool.');
            this.player1.clickCard(this.oldBruno);
            expect(this.oldBruno.tokens.amber).toBe(2);
            expect(this.player1.amber).toBe(2);
        });

        it('should move captured Amber to pool when fighting.', function () {
            this.player1.play(this.oldBruno);
            this.player1.fightWith(this.selwynTheFence, this.urchin);
            expect(this.player1).toHavePrompt('Choose a captured amber to move to your pool.');
            this.player1.clickCard(this.oldBruno);
            expect(this.oldBruno.tokens.amber).toBe(2);
            expect(this.player1.amber).toBe(1);
        });

        it('should not add Amber to pool when reaping if none is captured.', function () {
            this.player1.reap(this.selwynTheFence);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(1);
        });

        it('should not add Amber to pool when fighting if none is captured.', function () {
            this.player1.fightWith(this.selwynTheFence, this.urchin);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(0);
        });
    });
});
