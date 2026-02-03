describe('Banish', function () {
    describe("Banish's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['troll'],
                    hand: ['banish', 'elenya-the-charming']
                },
                player2: {
                    inPlay: ['batdrone', 'tunk']
                }
            });
        });

        it("should archive an enemy creature into opponent's archives", function () {
            this.player1.play(this.banish);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.tunk);
            this.player1.clickCard(this.batdrone);
            expect(this.player2.archives).toContain(this.batdrone);
            expect(this.player1).isReadyToTakeAction();
        });

        it("should archive an enemy creature into owner's archives", function () {
            this.player1.makeMaverick(this.elenyaTheCharming, 'dis');
            this.player1.playCreature(this.elenyaTheCharming);
            this.player1.play(this.banish);
            this.player1.clickCard(this.elenyaTheCharming);
            expect(this.player1.archives).toContain(this.elenyaTheCharming);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
