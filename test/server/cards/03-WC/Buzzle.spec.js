describe('Buzzle', function() {
    integration(function() {
        describe('Buzzle\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'dis',
                        hand: ['buzzle'],
                        inPlay: ['dust-imp'],
                        discard: ['pitlord', 'hand-of-dis']
                    },
                    player2: {
                        inPlay: ['batdrone']
                    }
                });
            });
            it('should trigger when played', function() {
                this.player1.play(this.buzzle);
                expect(this.player1).toHavePrompt('Buzzle');
                expect(this.player1).toBeAbleToSelect(this.dustImp);
                expect(this.player1).not.toBeAbleToSelect(this.buzzle);
                expect(this.player1).not.toBeAbleToSelect(this.batdrone);
                this.player1.clickCard(this.dustImp);
                this.player1.clickPrompt('Yes');
                expect(this.dustImp.location).toBe('purged');
                expect(this.buzzle.exhausted).toBe(false);
            });
        });
        describe('Buzzle\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'dis',
                        inPlay: ['dust-imp', 'buzzle', 'overlord-greking'],
                        discard: ['pitlord', 'hand-of-dis']
                    },
                    player2: {
                        inPlay: ['batdrone']
                    }
                });
            });
            it('should trigger when fighting', function() {
                this.player1.fightWith(this.buzzle, this.batdrone);
                expect(this.player1).toHavePrompt('Buzzle');
                expect(this.player1).toBeAbleToSelect(this.dustImp);
                expect(this.player1).toBeAbleToSelect(this.overlordGreking);
                expect(this.player1).not.toBeAbleToSelect(this.buzzle);
                expect(this.player1).not.toBeAbleToSelect(this.batdrone);
                this.player1.clickCard(this.overlordGreking);
                this.player1.clickPrompt('Yes');
                expect(this.overlordGreking.location).toBe('purged');
                expect(this.buzzle.exhausted).toBe(false);
                expect(this.batdrone.location).toBe('discard');
            });
        });
    });
});
