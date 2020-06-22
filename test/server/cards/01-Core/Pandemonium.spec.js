describe('Pandemonium', function () {
    describe("Pandemonium's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 4,
                    hand: ['pandemonium'],
                    inPlay: ['urchin', 'nexus', 'dextre', 'dodger']
                },
                player2: {
                    amber: 6,
                    inPlay: ['batdrone', 'mother', 'zorg']
                }
            });
            this.nexus.tokens.damage = 1;
            this.mother.tokens.damage = 3;
        });

        it('should cause undamaged creatures to capture 1', function () {
            this.player1.play(this.pandemonium);
            expect(this.urchin.tokens.amber).toBe(1);
            expect(this.dextre.tokens.amber).toBe(1);
            expect(this.dodger.tokens.amber).toBe(1);
            expect(this.batdrone.tokens.amber).toBe(1);
            expect(this.zorg.tokens.amber).toBe(1);
            expect(this.nexus.hasToken('amber')).toBe(false);
            expect(this.mother.hasToken('amber')).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt the player to pick creatures when there is insufficient amber', function () {
            this.player1.amber = 0;
            this.player2.amber = 2;
            this.player1.play(this.pandemonium);
            expect(this.player1).toHavePrompt('Pandemonium');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.dodger);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Pandemonium');
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            this.player1.clickCard(this.zorg);
            expect(this.urchin.tokens.amber).toBe(1);
            expect(this.dodger.tokens.amber).toBe(1);
            expect(this.zorg.tokens.amber).toBe(1);
            expect(this.nexus.hasToken('amber')).toBe(false);
            expect(this.dextre.hasToken('amber')).toBe(false);
            expect(this.batdrone.hasToken('amber')).toBe(false);
            expect(this.mother.hasToken('amber')).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
