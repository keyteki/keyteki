describe('The Warchest', function() {
    integration(function() {
        describe('The Warchest\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'brobnar',
                        inPlay: ['the-warchest', 'troll', 'valdr'],
                        hand: ['punch']
                    },
                    player2: {
                        inPlay: ['batdrone', 'snufflegator', 'sequis']
                    }
                });
            });

            it('should gain amber equal to the number of creatures destroyed in a fight', function() {
                this.player1.fightWith(this.troll, this.snufflegator);
                this.player1.fightWith(this.valdr, this.sequis);
                this.player1.play(this.punch);
                this.player1.clickCard(this.batdrone);
                expect(this.player1.amber).toBe(1);
                expect(this.snufflegator.location).toBe('discard');
                expect(this.sequis.location).toBe('discard');
                expect(this.batdrone.location).toBe('discard');
                this.player1.clickCard(this.theWarchest);
                this.player1.clickPrompt('Use this card\'s Action ability');
                expect(this.player1.amber).toBe(3);
            });
        });
    });
});
