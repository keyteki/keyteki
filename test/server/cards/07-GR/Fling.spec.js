describe('Fling', function () {
    describe("Fling's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['fling', 'blood-of-titans'],
                    inPlay: ['troll', 'cpo-zytar']
                },
                player2: {
                    inPlay: ['dust-pixie', 'thing-from-the-deep', 'flaxia']
                }
            });
        });

        it('destroys a creature and does that damage plus 3 splash to enemy', function () {
            this.player1.play(this.fling);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.thingFromTheDeep);
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.thingFromTheDeep.tokens.damage).toBe(4);
            expect(this.flaxia.tokens.damage).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('uses the creatures modified power', function () {
            this.player1.playUpgrade(this.bloodOfTitans, this.troll);
            this.player1.play(this.fling);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.thingFromTheDeep);
            expect(this.bloodOfTitans.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.thingFromTheDeep.tokens.damage).toBe(13);
            expect(this.flaxia.tokens.damage).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
