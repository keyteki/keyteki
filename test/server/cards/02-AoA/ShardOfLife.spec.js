describe('Shard of Life', function () {
    describe("Shard of Life's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['regrowth'],
                    inPlay: [
                        'dharna',
                        'shard-of-life',
                        'shard-of-greed',
                        'seeker-needle',
                        'shard-of-hope'
                    ],
                    discard: ['duskwitch', 'fanghouse', 'fogbank', 'key-charge']
                },
                player2: {
                    hand: ['remote-access', 'borrow'],
                    inPlay: ['shard-of-knowledge'],
                    discard: ['dextre', 'mother', 'archimedes']
                }
            });
        });

        it('should return 3 discarded cards to deck', function () {
            this.player1.useAction(this.shardOfLife);
            expect(this.player1).toBeAbleToSelect(this.duskwitch);
            expect(this.player1).toBeAbleToSelect(this.fanghouse);
            expect(this.player1).toBeAbleToSelect(this.fogbank);
            expect(this.player1).toBeAbleToSelect(this.keyCharge);
            expect(this.player1).not.toBeAbleToSelect(this.dharna);
            expect(this.player1).not.toBeAbleToSelect(this.regrowth);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.archimedes);
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            this.player1.clickCard(this.duskwitch);
            this.player1.clickCard(this.fogbank);
            this.player1.clickCard(this.keyCharge);
            this.player1.clickPrompt('Done');

            expect(this.duskwitch.location).toBe('deck');
            expect(this.fogbank.location).toBe('deck');
            expect(this.keyCharge.location).toBe('deck');
        });

        it('should work properly when Remote Accessed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.remoteAccess);
            expect(this.player2).toHavePrompt('Remote Access');
            this.player2.clickCard(this.shardOfLife);
            expect(this.player2).not.toBeAbleToSelect(this.duskwitch);
            expect(this.player2).not.toBeAbleToSelect(this.fanghouse);
            expect(this.player2).not.toBeAbleToSelect(this.fogbank);
            expect(this.player2).not.toBeAbleToSelect(this.keyCharge);
            expect(this.player2).not.toBeAbleToSelect(this.borrow);
            expect(this.player2).toBeAbleToSelect(this.dextre);
            expect(this.player2).toBeAbleToSelect(this.archimedes);
            expect(this.player2).toBeAbleToSelect(this.mother);
            this.player2.clickCard(this.mother);
            this.player2.clickCard(this.archimedes);
            this.player2.clickPrompt('Done');

            expect(this.mother.location).toBe('deck');
            expect(this.archimedes.location).toBe('deck');
        });

        it('should work properly when Borrowed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.borrow);
            this.player2.clickCard(this.shardOfLife);
            this.player2.useAction(this.shardOfLife);
            expect(this.player2).not.toBeAbleToSelect(this.duskwitch);
            expect(this.player2).not.toBeAbleToSelect(this.fanghouse);
            expect(this.player2).not.toBeAbleToSelect(this.fogbank);
            expect(this.player2).not.toBeAbleToSelect(this.keyCharge);
            expect(this.player2).not.toBeAbleToSelect(this.remoteAccess);
            expect(this.player2).toBeAbleToSelect(this.borrow);
            expect(this.player2).toBeAbleToSelect(this.dextre);
            expect(this.player2).toBeAbleToSelect(this.archimedes);
            expect(this.player2).toBeAbleToSelect(this.mother);
            this.player2.clickCard(this.mother);
            this.player2.clickCard(this.archimedes);
            this.player2.clickPrompt('Done');

            expect(this.mother.location).toBe('deck');
            expect(this.archimedes.location).toBe('deck');
        });

        describe('when there are no cards in discard', function () {
            beforeEach(function () {
                this.player2.moveCard(this.duskwitch, 'deck');
                this.player2.moveCard(this.fanghouse, 'deck');
                this.player2.moveCard(this.fogbank, 'deck');
                this.player2.moveCard(this.keyCharge, 'deck');
            });

            it('should not prompt', function () {
                this.player1.useAction(this.shardOfLife);
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
