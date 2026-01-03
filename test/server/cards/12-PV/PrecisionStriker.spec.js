describe('Precision Striker', function () {
    describe("Precision Striker's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['precision-striker', 'ember-imp']
                },
                player2: {
                    inPlay: ['culf-the-quiet'],
                    discard: ['krump', 'anger', 'uncharted-lands', 'troll']
                }
            });

            this.player2.moveCard(this.troll, 'deck');
            this.player2.moveCard(this.unchartedLands, 'deck');
            this.player2.moveCard(this.anger, 'deck');
            this.player2.moveCard(this.krump, 'deck');
        });

        it('should discard top 3 cards and put one on bottom when played', function () {
            this.player1.moveCard(this.precisionStriker, 'hand');
            this.player1.playCreature(this.precisionStriker);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.anger);
            expect(this.player1).toBeAbleToSelect(this.unchartedLands);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.krump);
            expect(this.player2.player.deck[0]).toBe(this.troll);
            expect(this.player2.player.deck[this.player2.player.deck.length - 1]).toBe(this.krump);
            expect(this.anger.location).toBe('discard');
            expect(this.unchartedLands.location).toBe('discard');
            expect(this.krump.location).toBe('deck');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should discard top 3 cards and put one on bottom after fight', function () {
            this.player1.fightWith(this.precisionStriker, this.culfTheQuiet);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.anger);
            expect(this.player1).toBeAbleToSelect(this.unchartedLands);
            this.player1.clickCard(this.anger);
            expect(this.player2.deck[0]).toBe(this.troll);
            expect(this.player2.deck[this.player2.deck.length - 1]).toBe(this.anger);
            expect(this.anger.location).toBe('deck');
            expect(this.unchartedLands.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should discard top 3 cards and put one on bottom after reap', function () {
            this.player1.reap(this.precisionStriker);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.anger);
            expect(this.player1).toBeAbleToSelect(this.unchartedLands);
            this.player1.clickCard(this.unchartedLands);
            expect(this.player2.deck[0]).toBe(this.troll);
            expect(this.player2.deck[this.player2.deck.length - 1]).toBe(this.unchartedLands);
            expect(this.anger.location).toBe('discard');
            expect(this.unchartedLands.location).toBe('deck');
            expect(this.krump.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not prompt for selection if opponent has fewer than 3 cards in deck', function () {
            this.player2.player.deck = [this.anger];
            this.player1.reap(this.precisionStriker);
            this.player1.clickCard(this.anger);
            expect(this.player2.deck[this.player2.deck.length - 1]).toBe(this.anger);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
