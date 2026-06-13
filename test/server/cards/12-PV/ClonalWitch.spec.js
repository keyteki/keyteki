describe('Clonal Witch', function () {
    describe("Clonal Witch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['clonal-witch', 'ember-imp', 'krump']
                },
                player2: {
                    inPlay: ['troll', 'titan-guardian', 'titan-mechanic', 'snufflegator']
                }
            });
        });

        it('should destroy creatures of the chosen house and gain amber for each destroyed', function () {
            this.player1.reap(this.clonalWitch);
            this.player1.clickPrompt('brobnar');

            // Brobnar creatures should be destroyed
            expect(this.krump.location).toBe('discard');
            expect(this.troll.location).toBe('discard');

            // Non-Brobnar creatures should survive
            expect(this.emberImp.location).toBe('play area');
            expect(this.titanGuardian.location).toBe('play area');
            expect(this.titanMechanic.location).toBe('play area');
            expect(this.snufflegator.location).toBe('play area');

            // Player should gain 2 amber (one for each Brobnar creature destroyed), plus 1 for the reap.
            expect(this.player1.amber).toBe(3);

            // Clonal Witch should be on top of the deck
            expect(this.clonalWitch.location).toBe('deck');
            expect(this.player1.deck[0]).toBe(this.clonalWitch);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target itself from discard', function () {
            this.player1.reap(this.clonalWitch);
            this.player1.clickPrompt('untamed');

            // Untamed creatures should not be destroyed
            expect(this.snufflegator.location).toBe('discard');

            // Non-Untamed creatures should survive
            expect(this.krump.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.emberImp.location).toBe('play area');
            expect(this.titanGuardian.location).toBe('play area');
            expect(this.titanMechanic.location).toBe('play area');

            // Player should gain 3 amber
            expect(this.player1.amber).toBe(3);

            // Clonal Witch should be on top of the deck
            expect(this.clonalWitch.location).toBe('deck');
            expect(this.player1.deck[0]).toBe(this.clonalWitch);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
