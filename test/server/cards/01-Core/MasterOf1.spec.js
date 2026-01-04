describe('Master of 1', function () {
    describe("Master of 1's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['master-of-1']
                },
                player2: {
                    inPlay: ['rotgrub', 'ember-imp', 'buzzle', 'charette']
                }
            });
        });

        it('should optionally destroy a creature with 1 power on reap', function () {
            this.player1.reap(this.masterOf1);
            expect(this.player1).toHavePrompt('Any reactions?');
            this.player1.clickCard(this.masterOf1);
            expect(this.player1).toBeAbleToSelect(this.rotgrub);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.buzzle);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            this.player1.clickCard(this.rotgrub);
            expect(this.rotgrub.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow declining to destroy', function () {
            this.player1.reap(this.masterOf1);
            expect(this.player1).toHavePrompt('Any reactions?');
            this.player1.clickPrompt('Done');
            expect(this.rotgrub.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
