describe('Regrowth', function () {
    describe("Regrowth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['regrowth', 'dust-pixie'],
                    discard: ['flaxia', 'murmook'],
                    inPlay: ['halacor']
                },
                player2: {
                    discard: ['troll'],
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should return a creature from discard to hand', function () {
            this.player1.play(this.regrowth);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.murmook);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.halacor);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('hand');
            expect(this.murmook.location).toBe('discard');
            expect(this.dustPixie.location).toBe('hand');
            expect(this.halacor.location).toBe('play area');
            expect(this.troll.location).toBe('discard');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
