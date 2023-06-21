describe('Lightbringer Outpost', function () {
    describe('Lightbringer Outpost effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 2,
                    inPlay: ['chelonia', 'flaxia', 'lightbringer-outpost'],
                    hand: ['troll'],
                    deck: ['krump', 'alaka']
                },
                player2: {
                    amber: 5,
                    inPlay: ['urchin', 'valoocanth', 'floomf']
                }
            });
        });

        it('should offer friendly creatures as selections for use', function () {
            this.player1.useAction(this.lightbringerOutpost);

            expect(this.player1).toHavePrompt('Choose a card to move to bottom of deck');
            expect(this.player1).toBeAbleToSelect(this.chelonia);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
        });

        it('should put a creature on the bottom of the deck', function () {
            this.player1.useAction(this.lightbringerOutpost);
            this.player1.clickCard(this.chelonia);

            expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(
                this.chelonia
            );
        });

        it('should offer friendly creatures to capture onto', function () {
            this.player1.useAction(this.lightbringerOutpost);
            this.player1.clickCard(this.chelonia);

            expect(this.player1).toHavePrompt('Choose a creature to capture amber');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.chelonia);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
        });

        it('should capture 3 amber', function () {
            this.player1.useAction(this.lightbringerOutpost);
            this.player1.clickCard(this.chelonia);
            this.player1.clickCard(this.flaxia);

            expect(this.flaxia.tokens.amber).toBe(3);
            expect(this.player2.player.amber).toBe(2);
        });

        describe('with no friendly creatures in play', function () {
            beforeEach(function () {
                this.chelonia.moveTo('discard');
                this.flaxia.moveTo('discard');
            });

            it('should not prompt to use the ability', function () {
                this.player1.useAction(this.lightbringerOutpost);

                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
        describe('with only one friendly creatures in play', function () {
            beforeEach(function () {
                this.flaxia.moveTo('discard');
            });

            it('should move creature to bottom of deck', function () {
                this.player1.useAction(this.lightbringerOutpost);
                this.player1.clickCard(this.chelonia);

                expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(
                    this.chelonia
                );
            });

            it('should not prompt to capture', function () {
                this.player1.useAction(this.lightbringerOutpost);
                this.player1.clickCard(this.chelonia);

                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
