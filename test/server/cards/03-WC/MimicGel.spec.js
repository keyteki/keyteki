describe('Mimic Gel', function() {
    integration(function() {
        describe('Mimic Gel\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        inPlay: ['batdrone', 'key-to-dis'],
                        hand: ['mimic-gel', 'phase-shift', 'dextre']
                    },
                    player2: {
                        inPlay: ['panpaca-anga', 'flaxia', 'tantadlin', 'bigtwig']
                    }
                });
            });

            it('should not allow Mimic Gel to be played if there are no creatures in play', function() {
                this.player1.useAction(this.keyToDis, true);
                expect(this.batdrone.location).toBe('discard');
                expect(this.panpacaAnga.location).toBe('discard');
                expect(this.flaxia.location).toBe('discard');
                expect(this.tantadlin.location).toBe('discard');
                expect(this.bigtwig.location).toBe('discard');
                this.player1.clickCard(this.mimicGel);
                expect(this.player1).toHavePrompt('Mimic Gel');
                expect(this.player1).toHavePromptButton('Discard this card');
                expect(this.player1).not.toHavePromptButton('Play this creature');
            });

            it('should not stop non mimic gel cards from being played', function() {
                this.player1.useAction(this.keyToDis, true);
                this.player1.clickCard(this.dextre);

                expect(this.player1).toHavePromptButton('Play this creature');
            });

            it('should prompt the player to pick a creature when played', function() {
                this.player1.clickCard(this.mimicGel);
                this.player1.clickPrompt('Play this creature');
                this.player1.clickPrompt('Left');
                expect(this.player1).toHavePrompt('Mimic Gel');
                expect(this.player1).toBeAbleToSelect(this.batdrone);
                expect(this.player1).toBeAbleToSelect(this.panpacaAnga);
                expect(this.player1).toBeAbleToSelect(this.flaxia);
                expect(this.player1).toBeAbleToSelect(this.tantadlin);
                expect(this.player1).toBeAbleToSelect(this.bigtwig);
            });

            it('should come into play as a copy of the chosen creature', function() {
                expect(this.mimicGel.hasTrait('shapeshifter')).toBe(true);
                this.player1.clickCard(this.mimicGel);
                this.player1.clickPrompt('Play this creature');
                this.player1.clickPrompt('Left');
                this.player1.clickCard(this.panpacaAnga);
                expect(this.mimicGel.location).toBe('play area');
                expect(this.mimicGel.hasTrait('shapeshifter')).toBe(false);
                expect(this.mimicGel.hasTrait('beast')).toBe(true);
                expect(this.mimicGel.hasHouse('logos')).toBe(true);
                expect(this.mimicGel.hasHouse('untamed')).toBe(false);
                expect(this.mimicGel.power).toBe(5);
                expect(this.mimicGel.name).toBe('Panpaca, Anga');
                expect(this.batdrone.power).toBe(4);
            });
        });
    });
});
