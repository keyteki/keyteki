describe('teleporter-chief-tink', function () {
    describe("Teleporter Chief Tink's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['teleporter-chief-tink', 'umbra', 'troll'],
                    hand: ['umbra']
                },
                player2: {
                    amber: 1,
                    inPlay: ['umbra']
                }
            });
        });

        it('when using should prompt to pick a creature to swap with and use that creature', function () {
            // confirm the starting order is correct
            expect(this.player1.player.cardsInPlay[0]).toBe(this.teleporterChiefTink);
            expect(this.player1.player.cardsInPlay[1]).toBe(this.umbra);
            expect(this.player1.player.cardsInPlay[2]).toBe(this.troll);
            // trigger the action
            this.player1.clickCard(this.teleporterChiefTink);
            expect(this.player1).toHavePromptButton("Use this card's Action ability");
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Teleporter Chief Tink');
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            // confirm we can reap with the creature
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Reap with this creature');
            // confirm the final ordering is correct
            expect(this.player1.player.cardsInPlay[0]).toBe(this.troll);
            expect(this.player1.player.cardsInPlay[1]).toBe(this.umbra);
            expect(this.player1.player.cardsInPlay[2]).toBe(this.teleporterChiefTink);
        });

        it('it should not prompt if there is only 1 creature in play', function () {
            this.player1.moveCard(this.troll, 'deck');
            this.player1.moveCard(this.umbra, 'deck');
            this.player1.clickCard(this.teleporterChiefTink);
            expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
        });
    });
});
