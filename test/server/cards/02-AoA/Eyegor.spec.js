describe('Eyegor', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['forgemaster-og'],
                    hand: ['eyegor', 'troll', 'urchin', 'titan-mechanic', 'brain-eater'],
                    amber: 4
                },
                player2: {
                    amber: 8,
                    inPlay: ['bumpsy']
                }
            });

            this.player1.moveCard(this.titanMechanic, 'deck');
            this.player1.moveCard(this.urchin, 'deck');
            this.player1.moveCard(this.troll, 'deck');

            this.player1.play(this.eyegor);
        });

        it('should prompt the top 3 cards from the deck', function () {
            expect(this.player1).toHavePromptCardButton(this.troll);
            expect(this.player1).toHavePromptCardButton(this.urchin);
            expect(this.player1).toHavePromptCardButton(this.titanMechanic);
        });

        describe('and a card is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('urchin');
            });

            it('should move that card to hand', function () {
                expect(this.urchin.location).toBe('hand');
            });

            it('should move the other cards to discard', function () {
                expect(this.troll.location).toBe('discard');
                expect(this.titanMechanic.location).toBe('discard');
            });
        });
    });
});
