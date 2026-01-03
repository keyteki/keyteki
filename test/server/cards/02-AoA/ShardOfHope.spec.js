describe('Shard of Hope', function () {
    describe("Shard of Hope's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'sanctum',
                    hand: ['gatekeeper'],
                    inPlay: [
                        'the-vaultkeeper',
                        'lord-golgotha',
                        'shard-of-hope',
                        'shard-of-greed',
                        'seeker-needle',
                        'shard-of-hope'
                    ]
                },
                player2: {
                    amber: 5,
                    hand: ['remote-access', 'borrow'],
                    inPlay: ['dextre', 'mother', 'archimedes', 'shard-of-knowledge']
                }
            });
        });

        it('should capture 1 maber for each friendly shard', function () {
            this.player1.useAction(this.shardOfHope);
            expect(this.player1).toBeAbleToSelect(this.theVaultkeeper);
            expect(this.player1).toBeAbleToSelect(this.lordGolgotha);
            expect(this.player1).not.toBeAbleToSelect(this.archimedes);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            this.player1.clickCard(this.theVaultkeeper);
            this.player1.clickCard(this.theVaultkeeper);
            this.player1.clickCard(this.lordGolgotha);

            expect(this.theVaultkeeper.amber).toBe(2);
            expect(this.lordGolgotha.amber).toBe(1);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);

            this.expectReadyToTakeAction(this.player1);
        });

        it('should work properly when Remote Accessed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.remoteAccess);
            expect(this.player2).toHavePrompt('Remote Access');
            this.player2.clickCard(this.shardOfHope);
            expect(this.player2).not.toBeAbleToSelect(this.theVaultkeeper);
            expect(this.player2).not.toBeAbleToSelect(this.lordGolgotha);
            expect(this.player2).toBeAbleToSelect(this.archimedes);
            expect(this.player2).toBeAbleToSelect(this.dextre);
            expect(this.player2).toBeAbleToSelect(this.mother);
            this.player2.clickCard(this.mother);
            this.player2.clickCard(this.mother);

            expect(this.mother.amber).toBe(2);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(6);

            this.expectReadyToTakeAction(this.player2);
        });

        it('should work properly when Borrowed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.borrow);
            this.player2.clickCard(this.shardOfHope);
            this.player2.useAction(this.shardOfHope);
            expect(this.player2).not.toBeAbleToSelect(this.theVaultkeeper);
            expect(this.player2).not.toBeAbleToSelect(this.lordGolgotha);
            expect(this.player2).toBeAbleToSelect(this.archimedes);
            expect(this.player2).toBeAbleToSelect(this.dextre);
            expect(this.player2).toBeAbleToSelect(this.mother);
            this.player2.clickCard(this.mother);
            this.player2.clickCard(this.mother);

            expect(this.mother.amber).toBe(2);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(6);

            this.expectReadyToTakeAction(this.player2);
        });

        describe('when opponent has no amber', function () {
            beforeEach(function () {
                this.player2.player.amber = 0;
            });

            it('should not prompt', function () {
                this.player1.useAction(this.shardOfHope);
                this.expectReadyToTakeAction(this.player1);
            });
        });

        describe('when opponent has less amber than shard', function () {
            beforeEach(function () {
                this.player2.player.amber = 1;
            });

            it('should prompt for only 1 creature', function () {
                this.player1.useAction(this.shardOfHope);
                this.player1.clickCard(this.lordGolgotha);

                expect(this.lordGolgotha.amber).toBe(1);
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(0);

                this.expectReadyToTakeAction(this.player1);
            });
        });
    });
});
