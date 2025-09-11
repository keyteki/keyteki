describe("Remmy's Horror", function () {
    describe("Remmy's Horror's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['remmy-s-horror'],
                    inPlay: ['troll', 'ancient-bear', 'ritual-of-balance']
                },
                player2: {
                    hand: ['nerve-blast', 'relentless-whispers'],
                    inPlay: ['urchin', 'seeker-needle']
                }
            });
        });

        it('should destroy a creature and an artifact, and purge a random card from opponent hand', function () {
            this.player1.play(this.remmySHorror);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).not.toBeAbleToSelect(this.ritualOfBalance);
            expect(this.player1).not.toBeAbleToSelect(this.seekerNeedle);
            this.player1.clickCard(this.troll);
            expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
            expect(this.player1).toBeAbleToSelect(this.seekerNeedle);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.troll.location).toBe('discard');
            expect(this.ritualOfBalance.location).toBe('discard');
            expect(this.ancientBear.location).toBe('play area');
            expect(this.urchin.location).toBe('play area');
            expect(this.seekerNeedle.location).toBe('play area');
            expect(this.player2.player.hand.length).toBe(1);
            expect(this.player2.player.purged.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work when there are no artifacts', function () {
            this.player1.moveCard(this.ritualOfBalance, 'discard');
            this.player2.moveCard(this.seekerNeedle, 'discard');
            this.player1.play(this.remmySHorror);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.ancientBear.location).toBe('play area');
            expect(this.urchin.location).toBe('play area');
            expect(this.player2.player.hand.length).toBe(1);
            expect(this.player2.player.purged.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work when there are no creatures', function () {
            this.player1.moveCard(this.troll, 'discard');
            this.player1.moveCard(this.ancientBear, 'discard');
            this.player2.moveCard(this.urchin, 'discard');
            this.player1.play(this.remmySHorror);
            this.player1.clickCard(this.seekerNeedle);
            expect(this.seekerNeedle.location).toBe('discard');
            expect(this.ritualOfBalance.location).toBe('play area');
            expect(this.player2.player.hand.length).toBe(1);
            expect(this.player2.player.purged.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work when there is nothing to destroy', function () {
            this.player1.moveCard(this.troll, 'discard');
            this.player1.moveCard(this.ancientBear, 'discard');
            this.player2.moveCard(this.ritualOfBalance, 'discard');
            this.player2.moveCard(this.urchin, 'discard');
            this.player2.moveCard(this.seekerNeedle, 'discard');
            this.player1.play(this.remmySHorror);
            expect(this.player2.player.hand.length).toBe(1);
            expect(this.player2.player.purged.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
