describe('One Stood Against Many', function() {
    integration(function() {
        describe('One Stood Against Many\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        inPlay: ['troll'],
                        hand: ['one-stood-against-many']
                    },
                    player2: {
                        hand: ['foggify'],
                        inPlay: ['dust-imp', 'ember-imp', 'shaffles']
                    }
                });
            });

            it('should allow fighting with a ready creature three times, and finish exhausted if it survives.', function() {
                this.player1.play(this.oneStoodAgainstMany);
                expect(this.player1).toHavePrompt('One Stood Against Many');
                this.player1.clickCard(this.troll);
                expect(this.player1).toHavePrompt('Choose a creature to attack');
                expect(this.player1).toBeAbleToSelect(this.dustImp);
                expect(this.player1).toBeAbleToSelect(this.emberImp);
                expect(this.player1).toBeAbleToSelect(this.shaffles);
                this.player1.clickCard(this.dustImp);
                expect(this.dustImp.location).toBe('discard');
                expect(this.troll.tokens.damage).toBe(2);
                expect(this.player1).toHavePrompt('Choose a creature to attack');
                expect(this.player1).not.toBeAbleToSelect(this.dustImp);
                expect(this.player1).toBeAbleToSelect(this.emberImp);
                expect(this.player1).toBeAbleToSelect(this.shaffles);
                this.player1.clickCard(this.emberImp);
                expect(this.emberImp.location).toBe('discard');
                expect(this.troll.tokens.damage).toBe(4);
                expect(this.player1).toHavePrompt('Choose a creature to attack');
                expect(this.player1).not.toBeAbleToSelect(this.dustImp);
                expect(this.player1).not.toBeAbleToSelect(this.emberImp);
                expect(this.player1).toBeAbleToSelect(this.shaffles);
                this.player1.clickCard(this.shaffles);
                expect(this.shaffles.location).toBe('discard');
                expect(this.troll.tokens.damage).toBe(6);
                expect(this.troll.exhausted).toBe(true);
            });

            it('should allow fighting with a ready creature three times, and finish ready with only two opponents.', function() {
                this.player1.play(this.oneStoodAgainstMany);
                expect(this.player1).toHavePrompt('One Stood Against Many');
                this.player1.clickCard(this.troll);
                expect(this.player1).toHavePrompt('Choose a creature to attack');
                expect(this.player1).toBeAbleToSelect(this.dustImp);
                expect(this.player1).toBeAbleToSelect(this.emberImp);
                expect(this.player1).toBeAbleToSelect(this.shaffles);
                this.player1.clickCard(this.dustImp);
                expect(this.dustImp.location).toBe('discard');
                expect(this.troll.tokens.damage).toBe(2);
                expect(this.player1).toHavePrompt('Choose a creature to attack');
                expect(this.player1).not.toBeAbleToSelect(this.dustImp);
                expect(this.player1).toBeAbleToSelect(this.emberImp);
                expect(this.player1).toBeAbleToSelect(this.shaffles);
                this.player1.clickCard(this.emberImp);
                expect(this.emberImp.location).toBe('discard');
                expect(this.troll.tokens.damage).toBe(4);
                expect(this.player1).toHavePrompt('Choose a creature to attack');
                expect(this.player1).not.toBeAbleToSelect(this.dustImp);
                expect(this.player1).not.toBeAbleToSelect(this.emberImp);
                expect(this.player1).toBeAbleToSelect(this.shaffles);
                this.player1.clickCard(this.shaffles);
                expect(this.shaffles.location).toBe('discard');
                expect(this.troll.tokens.damage).toBe(6);
                expect(this.troll.exhausted).toBe(true);
            });

            it('should ready a target when it cannot fight', function() {
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.play(this.foggify);
                this.player2.endTurn();
                this.player1.clickPrompt('sanctum');
                this.player1.play(this.oneStoodAgainstMany);
                expect(this.player1).toHavePrompt('One Stood Against Many');
                this.player1.clickCard(this.troll);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                expect(this.troll.exhausted).toBe(false);
            });

            it('should remove the stun from a stunned target', function() {
                this.troll.stun();
                this.player1.play(this.oneStoodAgainstMany);
                expect(this.player1).toHavePrompt('One Stood Against Many');
                this.player1.clickCard(this.troll);
                expect(this.troll.exhausted).toBe(true);
                expect(this.troll.stunned).toBe(false);
            });
            it('should remove the stun from a stunned target and still be able to fight twice', function() {
                this.troll.stun();
                this.player1.play(this.oneStoodAgainstMany);
                expect(this.player1).toHavePrompt('One Stood Against Many');
                this.player1.clickCard(this.troll);
                expect(this.troll.exhausted).toBe(true);
                expect(this.troll.stunned).toBe(false);
                expect(this.player1).toHavePrompt('Choose a creature to attack');
                expect(this.player1).toBeAbleToSelect(this.dustImp);
                expect(this.player1).toBeAbleToSelect(this.emberImp);
                expect(this.player1).toBeAbleToSelect(this.shaffles);
                this.player1.clickCard(this.dustImp);
                expect(this.dustImp.location).toBe('discard');
                expect(this.troll.tokens.damage).toBe(2);
                expect(this.player1).toHavePrompt('Choose a creature to attack');
                expect(this.player1).not.toBeAbleToSelect(this.dustImp);
                expect(this.player1).toBeAbleToSelect(this.emberImp);
                expect(this.player1).toBeAbleToSelect(this.shaffles);
                this.player1.clickCard(this.emberImp);
                expect(this.emberImp.location).toBe('discard');
                expect(this.troll.tokens.damage).toBe(4);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                expect(this.troll.exhausted).toBe(true);
            });
        });
        describe('One Stood Against Many\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        inPlay: ['troll'],
                        hand: ['one-stood-against-many']
                    },
                    player2: {
                        hand: ['foggify'],
                        inPlay: ['dust-imp', 'ember-imp']
                    }
                });
            });
            it('should allow fighting with a ready creature three times, and finish ready with only two opponents.', function() {
                this.player1.play(this.oneStoodAgainstMany);
                expect(this.player1).toHavePrompt('One Stood Against Many');
                this.player1.clickCard(this.troll);
                expect(this.player1).toHavePrompt('Choose a creature to attack');
                expect(this.player1).toBeAbleToSelect(this.dustImp);
                expect(this.player1).toBeAbleToSelect(this.emberImp);
                this.player1.clickCard(this.dustImp);
                expect(this.dustImp.location).toBe('discard');
                expect(this.troll.tokens.damage).toBe(2);
                expect(this.player1).toHavePrompt('Choose a creature to attack');
                expect(this.player1).not.toBeAbleToSelect(this.dustImp);
                expect(this.player1).toBeAbleToSelect(this.emberImp);
                this.player1.clickCard(this.emberImp);
                expect(this.emberImp.location).toBe('discard');
                expect(this.troll.tokens.damage).toBe(4);
                expect(this.troll.exhausted).toBe(false);
            });
        });
        describe('One Stood Against Many\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        inPlay: ['troll'],
                        hand: ['one-stood-against-many']
                    },
                    player2: {
                        hand: ['foggify'],
                        inPlay: ['dust-imp']
                    }
                });
            });
            it('should allow fighting with a ready creature three times, and finish ready with only one opponents.', function() {
                this.player1.play(this.oneStoodAgainstMany);
                expect(this.player1).toHavePrompt('One Stood Against Many');
                this.player1.clickCard(this.troll);
                expect(this.player1).toHavePrompt('Choose a creature to attack');
                expect(this.player1).toBeAbleToSelect(this.dustImp);
                this.player1.clickCard(this.dustImp);
                expect(this.dustImp.location).toBe('discard');
                expect(this.troll.tokens.damage).toBe(2);
                expect(this.troll.tokens.damage).toBe(2);
                expect(this.troll.exhausted).toBe(false);
            });
        });
    });
});
