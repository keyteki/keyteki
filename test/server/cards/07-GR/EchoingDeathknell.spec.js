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
            expect(this.oldBruno.tokens.damage).toBe(1);
            expect(this.batdrone.tokens.damage).toBe(1);
            expect(this.briarGrubbling.tokens.damage).toBe(1);
            expect(this.flaxia.tokens.damage).toBe(1);
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
            this.briarGrubbling.tokens.ward = 1;
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
