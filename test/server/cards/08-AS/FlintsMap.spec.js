describe("Flint's Map", function () {
    describe("Flint's Map's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 7,
                    house: 'untamed',
                    discard: ['flint-s-legend', 'flint-s-stash', 'treasure-island', 'dust-pixie'],
                    inPlay: ['flint-s-map']
                },
                player2: {
                    amber: 2,
                    discard: ['treasure-island']
                }
            });

            this.treasureIsland2 = this.player2.player.discard[0];
        });

        it('should search discard for and archive a Flint card on omni', function () {
            this.player1.useAction(this.flintSMap, true);
            expect(this.player1).toBeAbleToSelect(this.treasureIsland);
            expect(this.player1).toBeAbleToSelect(this.flintSLegend);
            expect(this.player1).toBeAbleToSelect(this.flintSStash);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.treasureIsland2);
            this.player1.clickCard(this.treasureIsland);
            this.player1.clickPrompt('Done');
            expect(this.treasureIsland.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should search deck for and archive a Flint card on omni', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.moveCard(this.treasureIsland, 'deck');
            this.player1.useAction(this.flintSMap, true);
            expect(this.player1).toBeAbleToSelect(this.treasureIsland);
            expect(this.player1).toBeAbleToSelect(this.flintSLegend);
            expect(this.player1).toBeAbleToSelect(this.flintSStash);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.treasureIsland2);
            this.player1.clickCard(this.treasureIsland);
            this.player1.clickPrompt('Done');
            expect(this.treasureIsland.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(1);
            expect(shuffled).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be optional', function () {
            this.player1.useAction(this.flintSMap, true);
            this.player1.clickPrompt('Done');
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
