describe('World Tree', function () {
    describe("World Tree's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['world-tree'],
                    discard: ['dust-pixie', 'niffle-ape', 'key-charge']
                },
                player2: {
                    discard: ['troll']
                }
            });
        });

        it('should return a creature from discard to top of deck', function () {
            this.player1.useAction(this.worldTree);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).not.toBeAbleToSelect(this.keyCharge);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('deck');
            expect(this.player1.player.deck[0]).toBe(this.dustPixie);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing with no creatures in discard', function () {
            this.player1.moveCard(this.dustPixie, 'hand');
            this.player1.moveCard(this.niffleApe, 'hand');
            this.player1.useAction(this.worldTree);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
