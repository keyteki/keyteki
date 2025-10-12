describe('Cauldron', function () {
    describe("Cauldron's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['snufflegator', 'knoxx', 'poke'],
                    inPlay: ['cauldron', 'near-future-lens'],
                    discard: ['witch-of-the-eye', 'ganger-chieftain', 'smith']
                },
                player2: {
                    inPlay: ['umbra'],
                    hand: ['befuddle'],
                    discard: ['quixxle-stone']
                }
            });
            this.player1.chains = 36;
            this.player1.moveCard(this.smith, 'deck');
            this.player1.moveCard(this.gangerChieftain, 'deck');
            this.player1.moveCard(this.witchOfTheEye, 'deck');
        });

        it('place top card of deck under itself', function () {
            this.player1.useAction(this.cauldron, true);
            expect(this.cauldron.childCards).toContain(this.witchOfTheEye);
        });

        describe('with 3 cards under', function () {
            beforeEach(function () {
                this.player1.useAction(this.cauldron, true);
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.useAction(this.cauldron, true);
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
            });

            it('play 3 cards', function () {
                this.player1.useAction(this.cauldron, true);
                this.player1.clickCard(this.witchOfTheEye);
                this.player1.clickCard(this.gangerChieftain);
                this.player1.clickPrompt('Right');
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                expect(this.player1.amber).toBe(4);
                expect(this.cauldron.childCards.length).toBe(0);
                expect(this.witchOfTheEye.location).toBe('play area');
                expect(this.gangerChieftain.location).toBe('play area');
                expect(this.smith.location).toBe('discard');
            });

            it('play 3 cards in any order', function () {
                this.player1.useAction(this.cauldron, true);
                this.player1.clickCard(this.smith);
                this.player1.clickCard(this.witchOfTheEye);
                this.player1.clickPrompt('Right');
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                expect(this.player1.amber).toBe(2);
            });

            it('puts cards that cannot be played back under itself', function () {
                this.player2.moveCard(this.quixxleStone, 'play area');
                this.player1.playCreature(this.snufflegator);
                this.player1.playCreature(this.knoxx);
                this.player1.useAction(this.cauldron, true);
                this.player1.clickCard(this.witchOfTheEye);
                expect(this.witchOfTheEye.location).toBe('under');
                this.player1.clickCard(this.gangerChieftain);
                expect(this.gangerChieftain.location).toBe('under');
                expect(this.player1.amber).toBe(4);
                expect(this.smith.location).toBe('discard');
                expect(this.cauldron.childCards.length).toBe(2);
            });

            it('lets players choose 3 if there are more than 3', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('unfathomable');
                this.player2.play(this.befuddle);
                this.player2.clickPrompt('logos');
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.useAction(this.cauldron, true);
                this.player1.clickCard(this.witchOfTheEye);
                expect(this.witchOfTheEye.location).toBe('under');
                this.player1.clickCard(this.gangerChieftain);
                expect(this.gangerChieftain.location).toBe('under');
                expect(this.smith.location).toBe('under');
                expect(this.player1.amber).toBe(1);
                this.player1.endTurn();
                this.player2.clickPrompt('unfathomable');
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.moveCard(this.poke, 'deck');
                this.player1.useAction(this.cauldron, true);
                expect(this.poke.location).toBe('under');
                expect(this.cauldron.childCards.length).toBe(4);
                this.cauldron.childCards.map((card) =>
                    console.log('card under cauldron:', card.name, card.location)
                );
                expect(this.gangerChieftain.location).toBe('under');
                this.player1.clickCard(this.witchOfTheEye);
                expect(this.witchOfTheEye.location).toBe('under');
                expect(this.witchOfTheEye.parent.name).toBe('Cauldron');
                expect(this.player1).toHavePrompt('Choose a card to play');
                // expect(this.witchOfTheEye.location).toBe('play area');
                this.player1.clickCard(this.gangerChieftain);
                this.player1.clickPrompt('Right');
                this.player1.clickPrompt('Done');
                this.player1.clickCard(this.smith);
                this.player1.clickCard(this.umbra); // Poke
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                expect(this.player1.amber).toBe(5);
                expect(this.cauldron.childCards.length).toBe(0);
                expect(this.witchOfTheEye.location).toBe('play area');
                expect(this.gangerChieftain.location).toBe('play area');
                expect(this.smith.location).toBe('discard');
                expect(this.poke.location).toBe('discard');
                expect(this.umbra.tokens.damage).toBe(1);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        it('trigger Near-Future Lens message', function () {
            this.player1.useAction(this.cauldron, true);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Near-Future Lens to reveal Ganger Chieftain'
            );
        });
    });
});
