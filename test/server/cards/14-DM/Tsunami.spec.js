describe('Tsunami', function () {
    describe("Tsunami's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['tsunami'],
                    inPlay: ['silvertooth', 'bumpsy']
                },
                player2: {
                    inPlay: ['troll', 'urchin', 'mooncurser']
                }
            });
        });

        it('deals 4 damage to each ready creature on both sides', function () {
            this.player1.play(this.tsunami);
            expect(this.silvertooth.location).toBe('discard');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.bumpsy.damage).toBe(4);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.damage).toBe(4);
            expect(this.urchin.location).toBe('discard');
            expect(this.mooncurser.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not damage exhausted creatures on either side', function () {
            this.silvertooth.exhaust();
            this.troll.exhaust();
            this.urchin.exhaust();
            this.player1.play(this.tsunami);
            expect(this.silvertooth.location).toBe('play area');
            expect(this.silvertooth.damage).toBe(0);
            expect(this.bumpsy.location).toBe('play area');
            expect(this.bumpsy.damage).toBe(4);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.damage).toBe(0);
            expect(this.urchin.location).toBe('play area');
            expect(this.urchin.damage).toBe(0);
            expect(this.mooncurser.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when there are no ready creatures', function () {
            this.silvertooth.exhaust();
            this.bumpsy.exhaust();
            this.troll.exhaust();
            this.urchin.exhaust();
            this.mooncurser.exhaust();
            this.player1.play(this.tsunami);
            expect(this.silvertooth.damage).toBe(0);
            expect(this.bumpsy.damage).toBe(0);
            expect(this.troll.damage).toBe(0);
            expect(this.urchin.damage).toBe(0);
            expect(this.mooncurser.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
