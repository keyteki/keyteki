describe('Tsunami', function () {
    describe("Tsunami's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['tsunami']
                },
                player2: {
                    inPlay: ['troll', 'urchin', 'mooncurser']
                }
            });
        });

        it('deals 4 damage to each ready creature', function () {
            this.player1.play(this.tsunami);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.damage).toBe(4);
            expect(this.urchin.location).toBe('discard');
            expect(this.mooncurser.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not damage exhausted creatures', function () {
            this.troll.exhaust();
            this.urchin.exhaust();
            this.player1.play(this.tsunami);
            expect(this.troll.damage).toBe(0);
            expect(this.urchin.location).toBe('play area');
            expect(this.mooncurser.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when there are no ready creatures', function () {
            this.troll.exhaust();
            this.urchin.exhaust();
            this.mooncurser.exhaust();
            this.player1.play(this.tsunami);
            expect(this.troll.damage).toBe(0);
            expect(this.urchin.damage).toBe(0);
            expect(this.mooncurser.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
