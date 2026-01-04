describe('Parallel Thinking', function () {
    describe("Parallel Thinking's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['parallel-thinking'],
                    discard: ['flaxia', 'searine', 'batdrone', 'poke', 'helper-bot']
                },
                player2: {
                    amber: 4,
                    discard: [
                        'ember-imp',
                        'draining-touch',
                        'ancient-bear',
                        'eldest-bear',
                        'urchin'
                    ]
                }
            });

            this.player1.player.deck = [];
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.searine, 'deck');
            this.player1.moveCard(this.batdrone, 'deck');
            this.player1.moveCard(this.poke, 'archives');
            this.player1.moveCard(this.helperBot, 'archives');

            this.player2.player.deck = [];
            this.player2.moveCard(this.emberImp, 'deck');
            this.player2.moveCard(this.drainingTouch, 'deck');
            this.player2.moveCard(this.ancientBear, 'deck');
            this.player2.moveCard(this.eldestBear, 'archives');
            this.player2.moveCard(this.urchin, 'archives');
        });

        it('should allow choosing between all four locations', function () {
            this.player1.play(this.parallelThinking);
            expect(this.player1).toHavePrompt('Choose a location to discard cards from');
            expect(this.player1.currentButtons).toContain('My Deck');
            expect(this.player1.currentButtons).toContain('My Archives');
            expect(this.player1.currentButtons).toContain("Opponent's Deck");
            expect(this.player1.currentButtons).toContain("Opponent's Archives");
        });

        it('should discard 2 cards from my deck', function () {
            this.player1.play(this.parallelThinking);
            this.player1.clickPrompt('My Deck');
            expect(this.batdrone.location).toBe('discard');
            expect(this.searine.location).toBe('discard');
            expect(this.flaxia.location).toBe('deck');
            expect(this.player1.player.deck.length).toBe(1);
            expect(this.player1.player.archives.length).toBe(2);
            expect(this.player1.player.discard.length).toBe(3);
            expect(this.player1.amber).toBe(2); // steal
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard 2 cards from my archives', function () {
            this.player1.play(this.parallelThinking);
            this.player1.clickPrompt('My Archives');
            expect(this.player1.player.deck.length).toBe(3);
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player1.player.discard.length).toBe(3);
            expect(this.player1.amber).toBe(0); // no steal
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it("should discard 2 cards from opponent's deck", function () {
            this.player1.play(this.parallelThinking);
            this.player1.clickPrompt("Opponent's Deck");
            expect(this.emberImp.location).toBe('deck');
            expect(this.drainingTouch.location).toBe('discard');
            expect(this.ancientBear.location).toBe('discard');
            expect(this.player2.player.deck.length).toBe(1);
            expect(this.player2.player.archives.length).toBe(2);
            expect(this.player2.player.discard.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it("should discard 2 cards from opponent's archives", function () {
            this.player1.play(this.parallelThinking);
            this.player1.clickPrompt("Opponent's Archives");
            expect(this.player2.player.deck.length).toBe(3);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.player2.player.discard.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal if only 1 card is discarded', function () {
            this.player1.moveCard(this.poke, 'discard');
            this.player1.play(this.parallelThinking);
            this.player1.clickPrompt('My Archives');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
