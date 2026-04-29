describe('Master of 2', function () {
    describe("Master of 2's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['master-of-2']
                },
                player2: {
                    inPlay: ['rotgrub', 'ember-imp', 'buzzle', 'charette']
                }
            });
        });

        it('should optionally destroy a creature with 2 power on reap', function () {
            this.player1.reap(this.masterOf2);
            expect(this.player1).toHavePrompt('Any reactions?');
            this.player1.clickCard(this.masterOf2);
            expect(this.player1).not.toBeAbleToSelect(this.rotgrub);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.buzzle);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow declining to destroy', function () {
            this.player1.reap(this.masterOf2);
            expect(this.player1).toHavePrompt('Any reactions?');
            this.player1.clickPrompt('Done');
            expect(this.emberImp.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
