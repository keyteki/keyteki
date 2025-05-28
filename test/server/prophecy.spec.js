describe('Prophecy', function () {
    describe('when activating a prophecy', function () {
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
                        'parasitic-arachniod',
                        'invigorating-shower',
                        'till-the-earth'
                    ],
                    inPlay: ['mushroom-man']
                },
                player2: {
                    amber: 5,
                    hand: ['spoo-key-charge', 'warfaline'],
                    inPlay: ['hunting-witch', 'umbra']
                }
            });
        });

        it('should allow activating prophecy with a fate card from hand', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);
            expect(this.ancientBear.location).toBe('under');
            expect(this.expectTheUnexpected.childCards.length).toBe(1);
            expect(this.expectTheUnexpected.childCards[0]).toBe(this.ancientBear);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.game.clickProphecy(this.player1.name, this.expectTheUnexpected.uuid);
            expect(this.parasiticArachniod.location).toBe('hand');
            expect(this.expectTheUnexpected.childCards.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not allow activating more than one prophecy in a turn', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);
            expect(this.ancientBear.location).toBe('under');
            expect(this.expectTheUnexpected.childCards.length).toBe(1);
            expect(this.expectTheUnexpected.childCards[0]).toBe(this.ancientBear);
            this.game.clickProphecy(this.player1.name, this.theCardsWillTell.uuid);
            expect(this.parasiticArachniod.location).toBe('hand');
            expect(this.theCardsWillTell.childCards.length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to activate a second prophecy on the next turn', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.activateProphecy(this.theCardsWillTell, this.parasiticArachniod);
            expect(this.parasiticArachniod.location).toBe('under');
            expect(this.theCardsWillTell.childCards.length).toBe(1);
            expect(this.theCardsWillTell.childCards[0]).toBe(this.parasiticArachniod);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not be able to activate the flip side of an activated prophecy', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.game.clickProphecy(this.player1.name, this.forgeAheadWithConfidence.uuid);
            expect(this.parasiticArachniod.location).toBe('hand');
            expect(this.forgeAheadWithConfidence.childCards.length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should resolve fate effects on opponent's turn", function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.parasiticArachniod);
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
            expect(this.parasiticArachniod.location).toBe('discard');
        });

        it('should not trigger during your turn when your opponent meets the condition', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);
            this.player1.play(this.tillTheEarth);
            expect(this.ancientBear.location).toBe('under');
            expect(this.expectTheUnexpected.childCards.length).toBe(1);
            expect(this.expectTheUnexpected.childCards[0]).toBe(this.ancientBear);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not trigger during your turn when you meet the condition', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);
            this.player1.play(this.invigoratingShower);
            this.player1.clickPrompt('untamed');
            expect(this.ancientBear.location).toBe('under');
            expect(this.expectTheUnexpected.childCards.length).toBe(1);
            expect(this.expectTheUnexpected.childCards[0]).toBe(this.ancientBear);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should not trigger during your opponent's turn when you meet the condition", function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.ancientBear);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.warfaline);
            this.player2.clickCard(this.warfaline);
            this.player2.clickPrompt("Opponent's");
            expect(this.ancientBear.location).toBe('under');
            expect(this.expectTheUnexpected.childCards.length).toBe(1);
            expect(this.expectTheUnexpected.childCards[0]).toBe(this.ancientBear);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
