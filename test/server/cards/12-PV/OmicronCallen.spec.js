describe('Omicron Callen', function () {
    describe("Omicron Callen's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    inPlay: ['omicron-callen', 'ember-imp', 'troll']
                },
                player2: {
                    inPlay: ['krump', 'titan-guardian', 'titan-mechanic']
                }
            });
        });

        it('should destroy each other creature after reaping', function () {
            this.player1.reap(this.omicronCallen);

            // All other creatures should be destroyed
            expect(this.emberImp.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.titanGuardian.location).toBe('discard');
            expect(this.titanMechanic.location).toBe('discard');

            // Omicron Callen should survive
            expect(this.omicronCallen.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy friendly creatures without matching neighbors when fate is triggered', function () {
            this.player1.moveCard(this.omicronCallen, 'hand');
            this.player1.activateProphecy(this.overreach, this.omicronCallen);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);

            expect(this.emberImp.location).toBe('play area');
            expect(this.krump.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.titanGuardian.location).toBe('play area');
            expect(this.titanMechanic.location).toBe('play area');
            expect(this.omicronCallen.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
