describe('Expect The Unexpected', function () {
    describe("Expect The Unexpected's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    prophecies: [
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'the-cards-will-tell',
                        'treat-each-action-as-your-last'
                    ],
                    hand: [
                        'ancient-bear',
                        'parasitic-arachnoid',
                        'invigorating-shower',
                        'till-the-earth'
                    ],
                    inPlay: ['mushroom-man']
                },
                player2: {
                    amber: 5,
                    hand: ['spoo-key-charge', 'warfaline', 'lost-in-the-woods'],
                    inPlay: ['hunting-witch', 'umbra']
                }
            });
        });

        it('should trigger when opponent shuffles their discard into their deck on their turn', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.spooKeyCharge);
            expect(this.player2).toBeAbleToSelect(this.huntingWitch);
            expect(this.player2).toBeAbleToSelect(this.umbra);
            expect(this.player2).not.toBeAbleToSelect(this.mushroomMan);
            this.player2.clickCard(this.umbra);
            expect(this.umbra.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.parasiticArachnoid.location).toBe('discard');
        });

        it('should not trigger when opponent shuffles creatures from play into their deck on their turn', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.lostInTheWoods);
            this.player2.clickCard(this.umbra);
            this.player2.clickCard(this.huntingWitch);
            this.player2.clickPrompt('Done');
            this.player2.clickCard(this.mushroomMan);
            this.player2.clickPrompt('Done');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.parasiticArachnoid.location).toBe('under');
        });
    });
});
