describe('The Cards Will Tell', function () {
    describe("The Cards Will Tell's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'the-cards-will-tell',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['ember-imp', 'parasitic-arachnoid'],
                    inPlay: ['charette']
                },
                player2: {
                    amber: 4,
                    hand: ['recklessness'],
                    inPlay: ['troll']
                }
            });
        });

        it('should fulfill when opponent draws a card outside of draw step', function () {
            this.player1.activateProphecy(this.theCardsWillTell, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.recklessness);
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(3);
            expect(this.troll.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not fulfill when opponent draws during draw step', function () {
            this.player1.activateProphecy(this.theCardsWillTell, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            expect(this.parasiticArachnoid.location).toBe('under');
        });
    });
});
