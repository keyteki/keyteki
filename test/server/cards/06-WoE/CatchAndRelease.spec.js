describe('Catch and Release', function () {
    describe("Catch and Release's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['sibyl-waimare', 'urchin', 'groke'],
                    hand: ['catch-and-release', 'nerve-blast', 'initiation', 'adult-swim', 'troll']
                },
                player2: {
                    inPlay: ['pelf', 'batdrone', 'skullback-crab'],
                    hand: [
                        'press-gang',
                        'rowdy-skald',
                        'labwork',
                        'interdimensional-graft',
                        'pour-tal',
                        'the-chosen-one'
                    ]
                }
            });
        });

        it('should return all creatures to hand and discard to 6 each', function () {
            let discardLength1 = this.player1.player.discard.length;
            let discardLength2 = this.player2.player.discard.length;
            this.player1.play(this.catchAndRelease);
            // Both players have more than 6 cards, so we get prompted for order
            expect(this.player1).toHavePrompt('Choose which player discards first');
            this.player1.clickPrompt('Me');
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player1.player.discard.length).toBe(discardLength1 + 2);
            expect(this.player2.player.creaturesInPlay.length).toBe(0);
            expect(this.player2.player.hand.length).toBe(6);
            expect(this.player2.player.discard.length).toBe(discardLength2 + 3);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.chains).toBe(2);
            expect(this.player2.chains).toBe(0);
        });

        it('should not return warded creatures', function () {
            this.pelf.ward();
            let discardLength1 = this.player1.player.discard.length;
            let discardLength2 = this.player2.player.discard.length;
            this.player1.play(this.catchAndRelease);
            // Both players have more than 6 cards, so we get prompted for order
            expect(this.player1).toHavePrompt('Choose which player discards first');
            this.player1.clickPrompt('Me');
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player1.player.discard.length).toBe(discardLength1 + 2);
            expect(this.player2.player.creaturesInPlay.length).toBe(1);
            expect(this.pelf.location).toBe('play area');
            expect(this.pelf.warded).toBe(false);
            expect(this.player2.player.hand.length).toBe(6);
            expect(this.player2.player.discard.length).toBe(discardLength2 + 2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not discard if you have fewer than 6 cards total', function () {
            this.player1.moveCard(this.nerveBlast, 'discard');
            this.player1.moveCard(this.troll, 'discard');
            let discardLength1 = this.player1.player.discard.length;
            let discardLength2 = this.player2.player.discard.length;
            this.player1.play(this.catchAndRelease);
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
            expect(this.player1.player.hand.length).toBe(5);
            expect(this.sibylWaimare.location).toBe('hand');
            expect(this.urchin.location).toBe('hand');
            expect(this.groke.location).toBe('hand');
            expect(this.player1.player.discard.length).toBe(discardLength1 + 1);
            expect(this.player2.player.creaturesInPlay.length).toBe(0);
            expect(this.player2.player.hand.length).toBe(6);
            expect(this.player2.player.discard.length).toBe(discardLength2 + 3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Catch and Release with scrap abilities', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['urchin'],
                    hand: ['catch-and-release'],
                    deck: ['urchin', 'urchin', 'urchin']
                },
                player2: {
                    inPlay: ['batdrone'],
                    // 8 cards in hand after return - need to discard 2 to get to 6
                    // Brillix Ponder has scrap that draws a card
                    hand: [
                        'brillix-ponder',
                        'batdrone',
                        'batdrone',
                        'batdrone',
                        'batdrone',
                        'batdrone',
                        'batdrone'
                    ],
                    deck: ['batdrone', 'batdrone', 'batdrone']
                }
            });
        });

        it('should continue discarding after scrap draws a card', function () {
            // Player 2 has 7 cards + 1 creature = 8 total after return
            // Without Brillix Ponder scrap, they'd discard 2 to get to 6
            // But if Brillix Ponder is discarded, it draws a card, so they need to discard again
            this.player1.play(this.catchAndRelease);
            // Only player2 has more than 6 cards
            // Player1 would have: catch-and-release (played) + urchin = 1 card in hand
            expect(this.player2.player.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
