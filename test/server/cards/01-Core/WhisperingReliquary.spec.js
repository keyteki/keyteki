describe('Whispering Reliquary', function () {
    describe("Whispering Reliquary's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['whispering-reliquary', 'autocannon', 'epic-quest']
                },
                player2: {
                    inPlay: ['the-sting', 'world-tree']
                }
            });
        });

        it('should return a friendly artifact to hand', function () {
            this.player1.useAction(this.whisperingReliquary);
            expect(this.player1).toBeAbleToSelect(this.whisperingReliquary);
            expect(this.player1).toBeAbleToSelect(this.autocannon);
            expect(this.player1).toBeAbleToSelect(this.epicQuest);
            this.player1.clickCard(this.autocannon);
            expect(this.autocannon.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should return an enemy artifact to hand', function () {
            this.player1.useAction(this.whisperingReliquary);
            this.player1.clickCard(this.theSting);
            expect(this.theSting.location).toBe('hand');
            expect(this.player2.hand).toContain(this.theSting);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should return itself to hand', function () {
            this.player1.useAction(this.whisperingReliquary);
            this.player1.clickCard(this.whisperingReliquary);
            expect(this.player1.hand).toContain(this.whisperingReliquary);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
