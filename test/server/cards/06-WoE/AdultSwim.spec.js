describe('Adult Swim', function () {
    describe("Adult Swim's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    token: 'trader',
                    hand: ['adult-swim'],
                    inPlay: ['seabringer-kekoa', 'trader:frost-giant', 'pelf', 'talent-scout']
                },
                player2: {
                    amber: 1,
                    inPlay: ['krump', 'gub', 'batdrone']
                }
            });
        });

        it("should return power 3 or less creatures to their owner's deck", function () {
            this.player1.play(this.adultSwim);
            expect(this.seabringerKekoa.location).toBe('play area');
            expect(this.trader.location).toBe('deck');
            expect(this.pelf.location).toBe('deck');
            expect(this.talentScout.location).toBe('deck');

            expect(this.krump.location).toBe('play area');
            expect(this.gub.location).toBe('play area');
            expect(this.batdrone.location).toBe('deck');
        });
    });
});
