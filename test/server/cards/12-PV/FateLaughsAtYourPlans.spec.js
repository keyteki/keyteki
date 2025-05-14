describe('Fate Laughs at Your Plans', function () {
    describe("Fate Laughs at Your Plans's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    prophecies: [
                        'fate-laughs-at-your-plans',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'bad-omen'
                    ],
                    hand: ['ancient-bear', 'parasitic-arachnoid'],
                    inPlay: ['mushroom-man'],
                    discard: ['spoo-key-charge']
                },
                player2: {
                    amber: 5,
                    hand: ['troll', 'haunting-witch'],
                    inPlay: ['dust-pixie', 'umbra'],
                    discard: ['ancient-bear']
                }
            });
        });

        it('should fulfill when opponent plays a card that shares a house with a card in their discard pile', function () {
            this.player1.activateProphecy(this.fateLaughsAtYourPlans, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.hauntingWitch);
            expect(this.player2).toBeAbleToSelect(this.hauntingWitch);
            expect(this.player2).toBeAbleToSelect(this.dustPixie);
            expect(this.player2).toBeAbleToSelect(this.umbra);
            expect(this.player2).not.toBeAbleToSelect(this.mushroomMan);
            this.player2.clickCard(this.hauntingWitch);
            expect(this.hauntingWitch.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not fulfill when opponent plays a card that does not share a house with any card in their discard pile', function () {
            this.player1.activateProphecy(this.fateLaughsAtYourPlans, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.troll);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not fulfill when you play a card that shares a house with a card in your discard pile', function () {
            this.player1.activateProphecy(this.fateLaughsAtYourPlans, this.parasiticArachnoid);
            this.player1.play(this.ancientBear);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
