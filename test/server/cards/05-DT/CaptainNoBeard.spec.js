describe('Captain No-Beard', function () {
    describe("Captain No-Beard's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'shadows',
                    inPlay: ['lamindra', 'shooler', 'captain-no-beard', 'gamgee']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });
        });

        it('should grant taunt to neighbors', function () {
            expect(this.lamindra.hasKeyword('taunt')).toBe(false);
            expect(this.shooler.hasKeyword('taunt')).toBe(true);
            expect(this.captainNoBeard.hasKeyword('taunt')).toBe(false);
            expect(this.gamgee.hasKeyword('taunt')).toBe(true);
        });

        it('should capture 1A when reaping', function () {
            this.player1.reap(this.captainNoBeard);
            expect(this.captainNoBeard.amber).toBe(1);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
        });
    });
});
