describe('Koriki Germinator', function () {
    describe("Koriki Germinator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['koriki-germinator'],
                    discard: ['old-bruno']
                },
                player2: {
                    discard: ['batdrone']
                }
            });
        });

        it('puts a friendly discard card on bottom of deck on play', function () {
            this.player1.playCreature(this.korikiGerminator);
            expect(this.player1).toBeAbleToSelect(this.oldBruno);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.oldBruno);
            expect(this.oldBruno.location).toBe('deck');
            expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(
                this.oldBruno
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('puts an enemy discard card on bottom of deck on play', function () {
            this.player1.playCreature(this.korikiGerminator);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('deck');
            expect(this.player2.player.deck[this.player2.player.deck.length - 1]).toBe(
                this.batdrone
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('puts a friendly discard card on bottom of deck on reap', function () {
            this.player1.playCreature(this.korikiGerminator);
            this.player1.clickCard(this.batdrone);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.player1.reap(this.korikiGerminator);
            this.player1.clickCard(this.oldBruno);
            expect(this.oldBruno.location).toBe('deck');
            expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(
                this.oldBruno
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
