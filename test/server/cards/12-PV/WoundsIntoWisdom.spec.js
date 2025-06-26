describe('Wounds into Wisdom', function () {
    describe("Wounds into Wisdom's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'wounds-into-wisdom',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['parasitic-arachnoid'],
                    inPlay: ['charette', 'xenos-bloodshadow', 'brabble']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'dust-pixie']
                }
            });
        });

        it('should fulfill when a friendly creature is dealt damage', function () {
            this.player1.activateProphecy(this.woundsIntoWisdom, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.charette);
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should fulfill after destroyed effects', function () {
            this.player1.activateProphecy(this.woundsIntoWisdom, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.brabble);
            this.player2.clickCard(this.troll);
            expect(this.troll.amber).toBe(1); // player2 lost 3A, so only 1A left to capture
            expect(this.player2.amber).toBe(0);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not fulfill when an enemy creature is dealt damage', function () {
            this.player1.activateProphecy(this.woundsIntoWisdom, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.xenosBloodshadow);
            expect(this.troll.tokens.damage).toBe(6);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
