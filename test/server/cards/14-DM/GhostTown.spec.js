describe('Ghost Town', function () {
    describe("Ghost Town's action", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['ghost-town'],
                    hand: ['troll']
                },
                player2: {}
            });
        });

        it('discards a card when not haunted', function () {
            expect(this.player1.player.isHaunted()).toBe(false);
            this.player1.useAction(this.ghostTown);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('archives a card when haunted', function () {
            for (let i = 0; i < 10; i++) {
                this.player1.moveCard(this.player1.player.deck[0], 'discard');
            }
            expect(this.player1.player.isHaunted()).toBe(true);
            this.player1.useAction(this.ghostTown);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player1.player.discard.length).toBe(10);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Ghost Town with empty hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['ghost-town']
                },
                player2: {}
            });
        });

        it('does nothing when hand is empty', function () {
            this.player1.useAction(this.ghostTown);
            expect(this.ghostTown.exhausted).toBe(true);
            expect(this.player1.player.discard.length).toBe(0);
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
