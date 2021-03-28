describe('Book of LeQ', function () {
    describe('Action ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'staralliance',
                    inPlay: ['book-of-leq', 'groggins'],
                    hand: ['troll', 'armsmaster-molina', 'krump']
                },
                player2: {
                    inPlay: ['dextre'],
                    hand: [
                        'foggify',
                        'dimension-door',
                        'hexpion',
                        'fetchdrones',
                        'rocket-boots',
                        'backup-copy'
                    ]
                }
            });
        });

        describe('when the top card of the deck is not star alliance and the action is triggered', function () {
            beforeEach(function () {
                this.player1.moveCard(this.troll, 'deck');
                this.player1.useAction(this.bookOfLeq);
            });

            it('should reveal the top card of the deck', function () {
                expect(this).toHaveRecentChatMessage('player1 uses Book of leQ to reveal Troll');
            });

            it('should set the active house to the house of the top card', function () {
                expect(this.player1.player.activeHouse).toBe('brobnar');
                this.player1.play(this.krump);
                this.player1.reap(this.groggins);
            });
        });

        describe('when the top card of the deck is star alliance and the action is triggered', function () {
            beforeEach(function () {
                this.player1.moveCard(this.armsmasterMolina, 'deck');
                this.player1.useAction(this.bookOfLeq);
            });

            it('should end the turn', function () {
                expect(this.game.activePlayer).toBe(this.player2.player);
            });

            it('should not ready cards', function () {
                expect(this.bookOfLeq.exhausted).toBe(true);
            });

            it('should allow opponent play to proceed as normal', function () {
                this.player2.clickPrompt('logos');
                this.player2.play(this.foggify);
                this.player2.play(this.dimensionDoor);
                this.player2.play(this.hexpion);
                this.player2.play(this.fetchdrones);
                this.player2.playUpgrade(this.rocketBoots, this.hexpion);
                this.player2.playUpgrade(this.backupCopy, this.hexpion);
            });
        });
    });
});
