describe('Boosted B4-RRY', function () {
    describe("Boosted B4-RRY's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    hand: ['boosted-b4-rry', 'boosted-b4-rry2'],
                    inPlay: ['seeker-needle']
                },
                player2: {
                    amber: 1,
                    hand: ['sneklifter'],
                    inPlay: ['library-of-babble', 'ritual-of-balance', 'dust-pixie'],
                    archives: ['the-circle-of-life', 'data-forge']
                }
            });
        });

        it('should not be able to play with just part 1', function () {
            this.player1.moveCard(this.boostedB4Rry2, 'discard');
            this.player1.clickCard(this.boostedB4Rry);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not be able to play with just part 2', function () {
            this.player1.moveCard(this.boostedB4Rry, 'discard');
            this.player1.clickCard(this.boostedB4Rry2);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 1', function () {
            this.player1.clickCard(this.boostedB4Rry);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 2', function () {
            this.player1.clickCard(this.boostedB4Rry2);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to steal an artifact on play', function () {
            this.player1.playCreature(this.boostedB4Rry);
            this.player1.clickPrompt('Take artifact');
            expect(this.player1).toBeAbleToSelect(this.libraryOfBabble);
            expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
            expect(this.player1).not.toBeAbleToSelect(this.seekerNeedle);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.player1.player.cardsInPlay).toContain(this.libraryOfBabble);
            this.player1.useAction(this.libraryOfBabble);
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.player.discard.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow stolen artifact to go back to original house when control is lost', function () {
            this.player1.playCreature(this.boostedB4Rry);
            this.player1.clickPrompt('Take artifact');
            this.player1.clickCard(this.libraryOfBabble);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.clickPrompt('No');
            this.player2.playCreature(this.sneklifter);
            this.player2.clickCard(this.libraryOfBabble);
            this.player2.clickCard(this.libraryOfBabble);
            expect(this.player2).isReadyToTakeAction();
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.clickPrompt('No');
            this.player2.useAction(this.libraryOfBabble);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should be able to play an archived card on play', function () {
            this.player1.playCreature(this.boostedB4Rry);
            this.player1.clickPrompt('Play archived card');
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.player.discard.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to play an archived card on reap', function () {
            this.player1.playCreature(this.boostedB4Rry);
            this.player1.clickPrompt('Play archived card');
            this.boostedB4Rry.ready();
            this.player1.reap(this.boostedB4Rry);
            this.player1.clickPrompt('Play archived card');
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.player.discard.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to play an archived card on fight', function () {
            this.player1.playCreature(this.boostedB4Rry);
            this.player1.clickPrompt('Play archived card');
            this.boostedB4Rry.ready();
            this.player1.fightWith(this.boostedB4Rry, this.dustPixie);
            this.player1.clickPrompt('Play archived card');
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.player.discard.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Armor', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    hand: ['boosted-b4-rry', 'boosted-b4-rry2'],
                    inPlay: []
                },
                player2: {
                    amber: 1,
                    inPlay: ['earthshaker']
                }
            });
        });

        it('should have 2 armor when played via the bottom half', function () {
            this.player1.playCreature(this.boostedB4Rry);
            this.player1.clickPrompt('Play archived card');
            expect(this.boostedB4Rry.armorTotal).toBe(2);
            expect(this.boostedB4Rry.tokens.armor).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should have 2 armor when played via the top half', function () {
            this.player1.playCreature(this.boostedB4Rry2);
            this.player1.clickPrompt('Play archived card');
            expect(this.boostedB4Rry2.armorTotal).toBe(2);
            expect(this.boostedB4Rry2.tokens.armor).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("when control of the stolen artifact returns to Boosted B4-RRY's controller", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['boosted-b4-rry', 'boosted-b4-rry2', 'art-project']
                },
                player2: {
                    inPlay: ['library-of-babble', 'uncommon-currency']
                }
            });
        });

        it('should re-apply house Shadows when control returns', function () {
            this.player1.playCreature(this.boostedB4Rry);
            this.player1.clickPrompt('Take artifact');
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.libraryOfBabble.controller).toBe(this.player1.player);
            expect(this.libraryOfBabble.getHouses()).toEqual(['shadows']);

            // Player2 swaps Library back via their Uncommon Currency.
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.useAction(this.uncommonCurrency);
            this.player2.clickCard(this.libraryOfBabble);
            this.player2.clickCard(this.libraryOfBabble);
            expect(this.libraryOfBabble.controller).toBe(this.player2.player);
            expect(this.libraryOfBabble.getHouses()).toEqual(['logos']);

            // Player1 swaps Library back via the same Uncommon Currency.
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.uncommonCurrency.ready();
            this.player1.useAction(this.uncommonCurrency);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.libraryOfBabble.controller).toBe(this.player1.player);

            // The Boosted B4-RRY house-change should still apply.
            expect(this.libraryOfBabble.getHouses()).toEqual(['shadows']);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
