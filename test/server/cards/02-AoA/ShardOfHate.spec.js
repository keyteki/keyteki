describe('Shard of Hate', function () {
    describe("Shard of Hate's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['blypyp'],
                    inPlay: [
                        'mindwarper',
                        'mindworm',
                        'shard-of-hate',
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

        it('should stun an enemy creatures', function () {
            this.player1.useAction(this.shardOfHate);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).not.toBeAbleToSelect(this.mindwarper);
            expect(this.player1).not.toBeAbleToSelect(this.mindworm);
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.dextre);

            expect(this.mother.stunned).toBe(true);
            expect(this.dextre.stunned).toBe(true);
            expect(this.archimedes.stunned).toBe(false);
            expect(this.mindwarper.stunned).toBe(false);
            expect(this.mindworm.stunned).toBe(false);

            expect(this.player1).isReadyToTakeAction();
        });

        it('should work properly when Remote Accessed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.remoteAccess);
            expect(this.player2).toHavePrompt('Remote Access');
            this.player2.clickCard(this.shardOfHate);
            expect(this.player2).not.toBeAbleToSelect(this.mother);
            expect(this.player2).not.toBeAbleToSelect(this.dextre);
            expect(this.player2).not.toBeAbleToSelect(this.archimedes);
            expect(this.player2).toBeAbleToSelect(this.mindwarper);
            expect(this.player2).toBeAbleToSelect(this.mindworm);
            this.player2.clickCard(this.mindwarper);
            this.player2.clickCard(this.mindworm);

            expect(this.mother.stunned).toBe(false);
            expect(this.dextre.stunned).toBe(false);
            expect(this.archimedes.stunned).toBe(false);
            expect(this.mindwarper.stunned).toBe(true);
            expect(this.mindworm.stunned).toBe(true);

            expect(this.player2).isReadyToTakeAction();
        });

        it('should work properly when Borrowed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.borrow);
            this.player2.clickCard(this.shardOfHate);
            this.player2.useAction(this.shardOfHate);
            expect(this.player2).not.toBeAbleToSelect(this.mother);
            expect(this.player2).not.toBeAbleToSelect(this.dextre);
            expect(this.player2).not.toBeAbleToSelect(this.archimedes);
            expect(this.player2).toBeAbleToSelect(this.mindwarper);
            expect(this.player2).toBeAbleToSelect(this.mindworm);
            this.player2.clickCard(this.mindwarper);
            this.player2.clickCard(this.mindworm);

            expect(this.mother.stunned).toBe(false);
            expect(this.dextre.stunned).toBe(false);
            expect(this.archimedes.stunned).toBe(false);
            expect(this.mindwarper.stunned).toBe(true);
            expect(this.mindworm.stunned).toBe(true);

            expect(this.player2).isReadyToTakeAction();
        });

        describe('when there are no enemy creatures in play', function () {
            beforeEach(function () {
                this.player2.moveCard(this.dextre, 'discard');
                this.player2.moveCard(this.mother, 'discard');
                this.player2.moveCard(this.archimedes, 'discard');
            });

            it('should not prompt', function () {
                this.player1.useAction(this.shardOfHate);
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
