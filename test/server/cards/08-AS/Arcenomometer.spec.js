describe('Arcenomometer', function () {
    describe("Arcenomometer's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['twin-bolt-emission', 'opposition-research'],
                    inPlay: ['arcenomometer']
                },
                player2: {
                    amber: 2,
                    hand: ['dust-pixie', 'ritual-of-balance']
                }
            });
        });

        it('should make opponent lose an amber next turn for every card played', function () {
            this.player1.useAction(this.arcenomometer);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.dustPixie);
            expect(this.player2.amber).toBe(3);
            this.player2.play(this.ritualOfBalance);
            expect(this.player2.amber).toBe(2);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should only affect opponent, only for one turn', function () {
            this.player1.useAction(this.arcenomometer);
            this.player1.play(this.twinBoltEmission);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.dustPixie);
            expect(this.player2.amber).toBe(3);
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.play(this.oppositionResearch);
            expect(this.player1.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.ritualOfBalance);
            expect(this.player2.amber).toBe(3);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
