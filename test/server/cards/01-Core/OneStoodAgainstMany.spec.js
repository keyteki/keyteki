describe('One Stood Against Many', function() {
    integration(function() {
        describe('One Stood Against Many\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        inPlay: ['francus', 'noddy-the-thief'],
                        hand: ['one-stood-against-many']
                    },
                    player2: {
                        inPlay: ['nexus', 'restringuntus', 'silvertooth']
                    }
                });
            });

            it('OSAM should ready and fight all three creatures end exhasted', function() {
                this.player1.play(this.oneStoodAgainstMany);
                expect(this.player1).toBeAbleToSelect(this.francus);
                this.player1.clickCard(this.francus);
                expect(this.player1).toBeAbleToSelect(this.nexus);
                expect(this.player1).toBeAbleToSelect(this.restringuntus);
                expect(this.player1).toBeAbleToSelect(this.silvertooth);
                this.player1.clickCard(this.nexus);
                expect(this.player1).not.toBeAbleToSelect(this.nexus);
                expect(this.player1).toBeAbleToSelect(this.restringuntus);
                expect(this.player1).toBeAbleToSelect(this.silvertooth);
                this.player1.clickCard(this.restringuntus);
                expect(this.player1).not.toBeAbleToSelect(this.nexus);
                expect(this.player1).not.toBeAbleToSelect(this.restringuntus);
                expect(this.player1).toBeAbleToSelect(this.silvertooth);
                this.player1.clickCard(this.silvertooth);
                expect(this.nexus.location).toBe('play area');
                expect(this.restringuntus.location).toBe('discard');
                expect(this.silvertooth.location).toBe('discard');
                expect(this.francus.exhausted).toBe(true);
            });

            it('OSAM should ready and fight both creatures end ready', function() {
                this.player2.moveCard(this.silvertooth, 'hand');
                this.player1.play(this.oneStoodAgainstMany);
                expect(this.player1).toBeAbleToSelect(this.francus);
                this.player1.clickCard(this.francus);
                this.player1.clickCard(this.nexus);
                expect(this.player1).not.toBeAbleToSelect(this.nexus);
                expect(this.player1).toBeAbleToSelect(this.restringuntus);
                this.player1.clickCard(this.restringuntus);
                expect(this.francus.exhausted).toBe(false);
                expect(this.nexus.location).toBe('play area');
                expect(this.restringuntus.location).toBe('discard');
            });

            it('OSAM should ready and fight both creatures end ready', function() {
                this.player2.moveCard(this.silvertooth, 'hand');
                this.player2.moveCard(this.nexus, 'hand');
                this.player1.play(this.oneStoodAgainstMany);
                expect(this.player1).toBeAbleToSelect(this.francus);
                this.player1.clickCard(this.francus);
                this.player1.clickCard(this.restringuntus);
                expect(this.francus.exhausted).toBe(false);
                expect(this.restringuntus.location).toBe('discard');
            });
        });
    });
});
