describe('Shae Cloudkicker', function () {
    describe("Shae Cloudkicker's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['shae-cloudkicker'],
                    inPlay: ['flaxia', 'dust-pixie']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should swap with another creature on play', function () {
            this.player1.playCreature(this.shaeCloudkicker);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.shaeCloudkicker);
            this.player1.clickCard(this.flaxia);
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.shaeCloudkicker);
            expect(this.player1.player.creaturesInPlay[2]).toBe(this.flaxia);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should swap with another creature on reap', function () {
            this.player1.playCreature(this.shaeCloudkicker);
            this.player1.clickCard(this.flaxia);
            this.shaeCloudkicker.ready();
            this.player1.reap(this.shaeCloudkicker);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.shaeCloudkicker);
            this.player1.clickCard(this.flaxia);
            expect(this.player1.player.creaturesInPlay[2]).toBe(this.shaeCloudkicker);
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.flaxia);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
