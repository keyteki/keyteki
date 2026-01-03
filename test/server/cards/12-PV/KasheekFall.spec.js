describe('Kasheek Fall', function () {
    describe("Kasheek Fall's ability", function () {
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
                    hand: ['kasheek-fall'],
                    inPlay: ['helmsman-spears', 'ember-imp', 'krump', 'troll']
                },
                player2: {
                    inPlay: ['groupthink-tank', 'titan-guardian', 'titan-mechanic']
                }
            });
        });

        it('should destroy creatures with more powerful neighbors when played', function () {
            this.player1.play(this.kasheekFall);
            expect(this.helmsmanSpears.location).toBe('play area');
            expect(this.emberImp.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.troll.location).toBe('play area');

            expect(this.groupthinkTank.location).toBe('discard');
            expect(this.titanGuardian.location).toBe('discard');
            expect(this.titanMechanic.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should destroy creatures with less powerful neighbors when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.kasheekFall);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.reap(this.titanMechanic);

            expect(this.helmsmanSpears.location).toBe('play area');
            expect(this.emberImp.location).toBe('play area');
            expect(this.krump.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.groupthinkTank.location).toBe('play area');
            expect(this.titanGuardian.location).toBe('discard');
            expect(this.titanMechanic.location).toBe('discard');
            expect(this.kasheekFall.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
