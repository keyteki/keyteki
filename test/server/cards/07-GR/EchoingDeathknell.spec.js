describe('Echoing Deathknell', function () {
    describe("Echoing Deathknell's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'unfathomable',
                    hand: ['skullback-crab', 'echoing-deathknell'],
                    inPlay: ['old-bruno']
                },
                player2: {
                    amber: 3,
                    inPlay: ['batdrone', 'briar-grubbling', 'flaxia']
                }
            });
        });

        it('does one damage once to every creature', function () {
            this.player1.play(this.echoingDeathknell);
            expect(this.oldBruno.damage).toBe(1);
            expect(this.batdrone.damage).toBe(1);
            expect(this.briarGrubbling.damage).toBe(1);
            expect(this.flaxia.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('repeats one damage as long as something is destroyed', function () {
            this.player1.playCreature(this.skullbackCrab);
            this.player1.play(this.echoingDeathknell);
            expect(this.skullbackCrab.location).toBe('discard');
            expect(this.oldBruno.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            expect(this.briarGrubbling.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('with ward repeats one damage as long as something is destroyed', function () {
            this.briarGrubbling.ward();
            this.player1.playCreature(this.skullbackCrab);
            this.player1.play(this.echoingDeathknell);
            expect(this.skullbackCrab.location).toBe('discard');
            expect(this.oldBruno.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            expect(this.briarGrubbling.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
