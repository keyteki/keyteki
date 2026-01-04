describe('TransmutingLift', function () {
    describe("TransmutingLift's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['transmuting-lift'],
                    inPlay: ['flaxia', 'dust-pixie', 'bosun-creen']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });
        });

        it('should let player move creature anywhere after reap', function () {
            this.player1.playUpgrade(this.transmutingLift, this.bosunCreen);
            this.player1.reap(this.bosunCreen);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.bosunCreen);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay[1]).toBe(this.bosunCreen);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
