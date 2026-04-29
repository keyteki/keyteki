describe('Broken Intent', function () {
    describe("Broken Intent's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    hand: ['broken-intent'],
                    archives: ['ember-imp', 'yurk'],
                    discard: ['draining-touch', 'urchin']
                },
                player2: {
                    amber: 4,
                    archives: ['flaxia', 'searine'],
                    discard: ['troll', 'anger']
                }
            });
        });

        it('should allow discarding archives', function () {
            this.player1.play(this.brokenIntent);
            this.player1.clickPrompt('Discard archives');
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.emberImp.location).toBe('discard');
            expect(this.yurk.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.searine.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow discarding just opponent archives', function () {
            this.player1.player.archives = [];
            this.player1.play(this.brokenIntent);
            this.player1.clickPrompt('Discard archives');
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.flaxia.location).toBe('discard');
            expect(this.searine.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow purging an action card from discard', function () {
            this.player1.play(this.brokenIntent);
            this.player1.clickPrompt('Purge action');
            expect(this.player1).toBeAbleToSelect(this.drainingTouch);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.anger);
            this.player1.clickCard(this.anger);
            expect(this.anger.location).toBe('purged');
            expect(this.brokenIntent.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
