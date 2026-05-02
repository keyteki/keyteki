describe('Dreamcall', function () {
    describe("Dreamcall's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['dreamcall'],
                    inPlay: ['silvertooth', 'lamindra'],
                    discard: ['dreamcall', 'dreamcall'],
                    deck: ['urchin', 'urchin', 'urchin']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy', 'krump']
                }
            });
        });

        it('exhausts a creature and exhausts more + draws cards based on copies in discard', function () {
            this.player1.play(this.dreamcall);
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            // TODO: verify this
            // expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(true);
            expect(this.player1.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('only exhausts target when no copies in discard', function () {
            this.player1.player.discard = [];
            this.player1.play(this.dreamcall);
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(false);
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target friendly creatures for both initial and additional exhausts', function () {
            this.player1.play(this.dreamcall);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.silvertooth);
            expect(this.silvertooth.exhausted).toBe(true);
            expect(this.player1).not.toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.lamindra);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            expect(this.lamindra.exhausted).toBe(true);
            expect(this.troll.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(false);
            expect(this.player1.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
