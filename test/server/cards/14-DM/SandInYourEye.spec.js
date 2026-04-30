describe('Sand In Your Eye', function () {
    describe("Sand In Your Eye's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['sand-in-your-eye'],
                    inPlay: ['urchin']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('exhausts a creature, draws a card per exhausted, and destroys all exhausted', function () {
            this.troll.exhaust();
            this.player1.play(this.sandInYourEye);
            this.player1.clickCard(this.krump);
            expect(this.urchin.location).toBe('play area');
            expect(this.troll.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('exhausts and destroys only the targeted creature when no others are exhausted', function () {
            this.player1.play(this.sandInYourEye);
            this.player1.clickCard(this.troll);
            expect(this.urchin.location).toBe('play area');
            expect(this.troll.location).toBe('discard');
            expect(this.krump.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1.hand.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target a friendly creature', function () {
            this.player1.play(this.sandInYourEye);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1.hand.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
