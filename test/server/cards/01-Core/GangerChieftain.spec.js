describe('Ganger Chieftain', function() {
    integration(function() {
        describe('Ganger Chieftain\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'brobnar',
                        hand: ['ganger-chieftain', 'anger'],
                        inPlay: ['troll', 'ancient-bear']
                    },
                    player2: {
                        inPlay: ['batdrone', 'doc-bookton']
                    }
                });
                this.player1.fightWith(this.troll, this.docBookton);
            });

            it('should allow fighting with an exhausted creature', function() {
                expect(this.troll.exhausted).toBe(true);
                expect(this.docBookton.location).toBe('discard');
                this.player1.playCreature(this.gangerChieftain, true);
                expect(this.player1).toHavePrompt('Ganger Chieftain');
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.gangerChieftain);
                expect(this.player1).not.toBeAbleToSelect(this.batdrone);
                expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
                this.player1.clickCard(this.troll);
                expect(this.player1).toHavePrompt('Choose a creature to attack');
                this.player1.clickCard(this.batdrone);
                expect(this.troll.exhausted).toBe(true);
                expect(this.batdrone.location).toBe('discard');
                expect(this.troll.tokens.damage).toBe(7);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('should allow fighting with a non-house creature', function() {
                this.player1.play(this.gangerChieftain);
                expect(this.player1).toHavePrompt('Ganger Chieftain');
                expect(this.player1).not.toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.gangerChieftain);
                expect(this.player1).not.toBeAbleToSelect(this.batdrone);
                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                this.player1.clickCard(this.ancientBear);
                expect(this.player1).toHavePrompt('Choose a creature to attack');
                this.player1.clickCard(this.batdrone);
                expect(this.batdrone.location).toBe('discard');
                expect(this.troll.tokens.damage).toBe(5);
                expect(this.ancientBear.exhausted).toBe(true);
                expect(this.ancientBear.hasToken('damage')).toBe(false);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('should ready creatures who can\'t fight', function() {
                this.player1.play(this.anger);
                this.player1.clickCard(this.ancientBear);
                expect(this.player1).toHavePrompt('Choose a creature to attack');
                this.player1.clickCard(this.batdrone);
                expect(this.batdrone.location).toBe('discard');
                this.player1.playCreature(this.gangerChieftain, true);
                expect(this.player1).toHavePrompt('Ganger Chieftain');
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.gangerChieftain);
                expect(this.player1).not.toBeAbleToSelect(this.batdrone);
                expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
                this.player1.clickCard(this.troll);
                expect(this.troll.exhausted).toBe(false);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
