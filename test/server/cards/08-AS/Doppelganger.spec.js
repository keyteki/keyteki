describe('Doppelganger', function () {
    describe("Doppelganger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    token: 'prowler',
                    hand: ['touchstone'],
                    inPlay: ['prowler:bulleteye', 'umbra', 'doppelganger', 'hunting-witch'],
                    discard: ['doppelganger']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll']
                }
            });

            this.doppelganger2 = this.player1.player.discard[0];
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
        });

        it('should gain a fight ability at the beginning of the turn', function () {
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.umbra);
            this.player1.clickPrompt('geistoid');
            this.player1.fightWith(this.doppelganger, this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.doppelganger.location).toBe('play area');
            expect(this.doppelganger.tokens.damage).toBe(undefined);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            // Make sure the ability is gone.
            this.player1.clickCard(this.huntingWitch);
            this.player1.clickPrompt('geistoid');
            this.player1.fightWith(this.doppelganger, this.troll);
            expect(this.doppelganger.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(6);
        });

        it('should gain a static ability at the beginning of the turn', function () {
            this.player1.clickCard(this.huntingWitch);
            this.player1.clickPrompt('geistoid');
            this.player1.playCreature(this.touchstone);
            this.player1.clickCard(this.doppelganger);
            expect(this.player1.amber).toBe(3);
        });

        it('should not be optional unless there are 2 adjacent shapeshifters', function () {
            expect(this.player1).not.toHavePromptButton('Done');
        });

        it('should allow breaking from infinite loop with 2 next to each other', function () {
            this.player1.clickCard(this.huntingWitch);
            this.player1.clickPrompt('geistoid');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player1.moveCard(this.huntingWitch, 'discard');
            this.player1.moveCard(this.doppelganger2, 'play area');
            this.player2.endTurn();

            this.player1.clickCard(this.doppelganger);
            this.player1.clickCard(this.doppelganger2);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('geistoid');
        });

        it('should gain the token creature’s abilities, not the face-up side’s abilities', function () {
            // Get rid of Umbra so that Prowler is a neighbor
            this.player1.moveCard(this.umbra, 'discard');

            // This Prowler has a Bulleteye on the other side
            this.player1.clickCard(this.prowler);

            this.player1.clickPrompt('geistoid');

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);

            this.player1.reap(this.doppelganger);

            // +1 from reap, +1 from Prowler steal
            expect(this.player1.amber).toBe(3);
            // -1 from Prowler steal
            expect(this.player2.amber).toBe(2);

            // Doppelganger should _not_ be prompting for Bulleteye’s After Reap
            // of destroying a flank creature.
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
