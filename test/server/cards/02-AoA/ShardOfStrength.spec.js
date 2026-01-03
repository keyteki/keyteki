describe('Shard of Strength', function () {
    describe("Shard of Strength's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['brammo'],
                    inPlay: [
                        'cowfyne',
                        'foozle',
                        'shard-of-strength',
                        'shard-of-greed',
                        'seeker-needle',
                        'shard-of-hope'
                    ]
                },
                player2: {
                    hand: ['remote-access', 'borrow'],
                    inPlay: ['dextre', 'mother', 'archimedes', 'shard-of-knowledge']
                }
            });
        });

        it('should give a friendly creature a +1 power counter for each friendly Shard', function () {
            this.player1.useAction(this.shardOfStrength);
            expect(this.player1).toBeAbleToSelect(this.cowfyne);
            expect(this.player1).toBeAbleToSelect(this.foozle);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.archimedes);
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            this.player1.clickCard(this.cowfyne);

            expect(this.cowfyne.tokens.power).toBe(3);
        });

        it('should work properly when Remote Accessed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.remoteAccess);
            expect(this.player2).toHavePrompt('Remote Access');
            this.player2.clickCard(this.shardOfStrength);
            expect(this.player2).not.toBeAbleToSelect(this.cowfyne);
            expect(this.player2).not.toBeAbleToSelect(this.foozle);
            expect(this.player2).toBeAbleToSelect(this.dextre);
            expect(this.player2).toBeAbleToSelect(this.archimedes);
            expect(this.player2).toBeAbleToSelect(this.mother);
            this.player2.clickCard(this.mother);
            expect(this.mother.tokens.power).toBe(2);
        });

        it('should work properly when Borrowed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.borrow);
            this.player2.clickCard(this.shardOfStrength);
            this.player2.useAction(this.shardOfStrength);
            expect(this.player2).not.toBeAbleToSelect(this.cowfyne);
            expect(this.player2).not.toBeAbleToSelect(this.foozle);
            expect(this.player2).toBeAbleToSelect(this.dextre);
            expect(this.player2).toBeAbleToSelect(this.archimedes);
            expect(this.player2).toBeAbleToSelect(this.mother);
            this.player2.clickCard(this.mother);
            expect(this.mother.tokens.power).toBe(2);
        });

        describe('when there are no friendly creatures in play', function () {
            beforeEach(function () {
                this.player1.moveCard(this.cowfyne, 'discard');
                this.player1.moveCard(this.foozle, 'discard');
            });

            it('should not prompt', function () {
                this.player1.useAction(this.shardOfStrength);
                this.expectReadyToTakeAction(this.player1);
            });
        });
    });
});
