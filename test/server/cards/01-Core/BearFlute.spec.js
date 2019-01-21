describe('Bear Flute', function() {
    integration(function() {
        describe('Bear Flute\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        inPlay: ['bear-flute'],
                        hand: ['cooperative-hunting', 'regrowth'],
                        discard: ['ancient-bear']
                    },
                    player2: {
                        inPlay: []
                    }
                });
            });

            it('should search for a bear when there isn\'t one in play', function() {
                this.player1.clickCard(this.bearFlute);
                this.player1.clickPrompt('Use this card\'s Action ability');
                expect(this.player1).toHavePrompt('Bear Flute');
                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                this.player1.clickCard(this.ancientBear);
                this.player1.clickPrompt('Done');
                expect(this.ancientBear.location).toBe('hand');
            });

            it('should heal a bear when there is one in play', function() {
                this.player1.play(this.regrowth);
                this.player1.clickCard(this.ancientBear);
                expect(this.ancientBear.location).toBe('hand');
                this.player1.play(this.ancientBear);
                expect(this.ancientBear.location).toBe('play area');
                this.player1.play(this.cooperativeHunting);
                this.player1.clickCard(this.ancientBear);
                expect(this.ancientBear.tokens.damage).toBe(1);
                this.player1.clickCard(this.bearFlute);
                this.player1.clickPrompt('Use this card\'s Action ability');
                expect(this.player1).toHavePrompt('Bear Flute');
                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                this.player1.clickCard(this.ancientBear);
                expect(this.ancientBear.hasToken('damage')).toBe(false);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('should not be usable when there is an undamaged bear on the field', function() {
                this.player1.play(this.regrowth);
                this.player1.clickCard(this.ancientBear);
                expect(this.ancientBear.location).toBe('hand');
                this.player1.play(this.ancientBear);
                expect(this.ancientBear.location).toBe('play area');
                this.player1.clickCard(this.bearFlute);
                expect(this.player1).toHavePrompt('Bear Flute');
                this.player1.clickPrompt('Use this card\'s Action ability');
                expect(this.player1).toHavePrompt('Bear Flute');
                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                this.player1.clickCard(this.ancientBear);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
