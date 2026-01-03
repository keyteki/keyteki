describe('Urxym the Diplomat', function () {
    describe("Urxym the Diplomat's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    inPlay: ['urxym-the-diplomat', 'flaxia']
                },
                player2: {
                    inPlay: ['dust-pixie', 'thing-from-the-deep', 'tunk']
                }
            });
        });

        it('loses all amber on reap', function () {
            this.player1.reap(this.urxymTheDiplomat);
            expect(this.player1.amber).toBe(0);
        });

        it('destroys an enemy non-Mars creature for each amber lost', function () {
            this.player1.reap(this.urxymTheDiplomat);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.urxymTheDiplomat);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.urxymTheDiplomat);
            this.player1.clickCard(this.thingFromTheDeep);
            expect(this.thingFromTheDeep.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('stops when out of enemy non-Mars creatures', function () {
            this.player2.moveCard(this.thingFromTheDeep, 'discard');
            this.player1.reap(this.urxymTheDiplomat);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
