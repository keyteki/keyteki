describe('Echo Guardian', function () {
    describe("Echo Guardian's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'unfathomable',
                    hand: ['crushing-deep'],
                    inPlay: ['echo-guardian'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['sinder', 'urchin', 'batdrone']
                }
            });
        });

        it('has no modifications when not haunted', function () {
            expect(this.echoGuardian.power).toBe(1);
            expect(this.echoGuardian.hasKeyword('poison')).toBe(false);
        });

        it('gains poison and extra power when haunted', function () {
            this.player1.play(this.crushingDeep);
            expect(this.echoGuardian.power).toBe(3);
            expect(this.echoGuardian.hasKeyword('poison')).toBe(true);
            this.player1.fightWith(this.echoGuardian, this.sinder);
            expect(this.sinder.location).toBe('discard');
            expect(this.echoGuardian.tokens.damage).toBe(2);
            expect(this.echoGuardian.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
