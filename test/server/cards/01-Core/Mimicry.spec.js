describe('Mimicry', function() {
    integration(function() {
        describe('Mimicry\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        hand: ['mimicry'],
                        discard: ['snufflegator']
                    },
                    player2: {
                        amber: 5,
                        discard: ['neuro-syphon', 'wild-wormhole']
                    }
                });
                this.player1.moveCard(this.snufflegator, 'deck');
            });

            it('should work correctly with Neuro Syphon', function() {
                this.player1.play(this.mimicry);
                this.player1.clickCard(this.neuroSyphon)
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(4);
                expect(this.player1.hand.length).toBe(1);
            });
        });
    });
});