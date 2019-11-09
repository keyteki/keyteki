describe('Weasand', function() {
    integration(function() {
        describe('Weasand\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'shadows',
                        inPlay: ['lamindra', 'redlock'],
                        hand: ['weasand']
                    },
                    player2: {
                        inPlay: ['drummernaut']
                    }
                });
            });

            it('should not gain amber if opponent does not forge a key', function() {
                this.player1.playCreature(this.weasand, true, true);
                this.player1.clickCard(this.redlock);
                expect(this.weasand.location).toBe('play area');
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                expect(this.player1.amber).toBe(0);
            });

            it('should gain 2 amber if opponent forges a key', function() {
                this.player2.amber = 6;
                this.player1.playCreature(this.weasand, true, true);
                this.player1.clickCard(this.redlock);
                expect(this.weasand.location).toBe('play area');
                this.player1.endTurn();
                this.player2.clickPrompt('Red');
                this.player2.clickPrompt('brobnar');
                expect(this.player2.amber).toBe(0);
                expect(this.player1.amber).toBe(2);
            });

            it('should be destroyed if on a flank right after play', function() {
                this.player1.playCreature(this.weasand);
                expect(this.weasand.location).toBe('discard');
            });

            it('should be destroyed if on a flank after a fight', function() {
                this.player1.playCreature(this.weasand, true, true);
                this.player1.clickCard(this.redlock);
                expect(this.weasand.location).toBe('play area');
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.fightWith(this.drummernaut, this.redlock);
                expect(this.redlock.location).toBe('discard');
                expect(this.weasand.location).toBe('discard');
            });

        });
    });
});
