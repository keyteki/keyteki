describe('Bouncing Death Quark', function () {
    describe("Bouncing Death Quark's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['batdrone', 'doc-bookton', 'bouncing-deathquark', 'twin-bolt-emission'],
                    inPlay: ['mother']
                },
                player2: {
                    inPlay: ['macis-asp', 'silvertooth', 'urchin']
                }
            });
        });

        it('should prompt the player to kill two targets', function () {
            this.player1.play(this.bouncingDeathquark);
            expect(this.player1).toHavePrompt('Bouncing Deathquark');
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.macisAsp);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.macisAsp);
            expect(this.player1).toHavePrompt('Bouncing Deathquark');
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.macisAsp);
            expect(this.player1).not.toBeAbleToSelect(this.silvertooth);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.mother);
            expect(this.mother.location).toBe('discard');
            expect(this.macisAsp.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt the player to repeat the ability when more targets exist', function () {
            this.player1.play(this.batdrone);
            this.player1.play(this.bouncingDeathquark);
            this.player1.clickCard(this.macisAsp);
            this.player1.clickCard(this.mother);
            expect(this.mother.location).toBe('discard');
            expect(this.macisAsp.location).toBe('discard');
            expect(this.player1).toHavePrompt('Do you wish to repeat this effect?');
            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should repeat 3 times', function () {
            this.player1.play(this.batdrone);
            this.player1.play(this.docBookton);
            this.player1.play(this.bouncingDeathquark);
            this.player1.clickCard(this.macisAsp);
            this.player1.clickCard(this.mother);
            expect(this.mother.location).toBe('discard');
            expect(this.macisAsp.location).toBe('discard');
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.batdrone);
            expect(this.urchin.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).toHavePrompt('Do you wish to repeat this effect?');
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.silvertooth);
            this.player1.clickCard(this.docBookton);
            expect(this.silvertooth.location).toBe('discard');
            expect(this.docBookton.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should kill only an enemy creature if there are no friendly creatures', function () {
            this.player1.fightWith(this.mother, this.macisAsp);
            expect(this.mother.location).toBe('discard');
            expect(this.macisAsp.location).toBe('discard');
            this.player1.play(this.bouncingDeathquark);
            expect(this.player1).toHavePrompt('Bouncing Deathquark');
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should kill only a friendly creature if there are no enemy creatures', function () {
            this.player1.fightWith(this.mother, this.macisAsp);
            expect(this.mother.location).toBe('discard');
            expect(this.macisAsp.location).toBe('discard');
            this.player1.play(this.twinBoltEmission);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.silvertooth);
            this.player1.clickPrompt('Done');
            expect(this.urchin.location).toBe('discard');
            expect(this.silvertooth.location).toBe('discard');
            this.player1.play(this.batdrone);
            this.player1.play(this.bouncingDeathquark);
            expect(this.player1).toHavePrompt('Bouncing Deathquark');
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
