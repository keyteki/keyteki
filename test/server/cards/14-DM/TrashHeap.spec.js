describe('Trash Heap', function () {
    describe("Trash Heap's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: [
                        'trash-heap',
                        'troll',
                        'lamindra',
                        'bait-and-switch',
                        'finishing-blow',
                        'ghostly-hand'
                    ],
                    inPlay: ['echofly']
                },
                player2: {
                    hand: ['bumpsy', 'paranormal-palisade', 'anger', 'barehanded', 'blood-money'],
                    inPlay: ['krump']
                }
            });
        });

        it('destroys all creatures, discards creatures from hands, refills hands', function () {
            this.player1.play(this.trashHeap);
            expect(this.player1).toHavePromptButton('Me');
            expect(this.player1).toHavePromptButton('Opponent');
            this.player1.clickPrompt('Me');

            // player 1
            expect(this.troll.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.baitAndSwitch.location).toBe('hand');
            expect(this.finishingBlow.location).toBe('hand');
            expect(this.ghostlyHand.location).toBe('hand');
            expect(this.echofly.location).toBe('discard');
            // player 2
            expect(this.bumpsy.location).toBe('discard');
            expect(this.paranormalPalisade.location).toBe('discard');
            expect(this.anger.location).toBe('hand');
            expect(this.barehanded.location).toBe('hand');
            expect(this.bloodMoney.location).toBe('hand');
            expect(this.krump.location).toBe('discard');

            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player2.player.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('lets the active player choose Opponent to discard first', function () {
            this.player1.play(this.trashHeap);
            this.player1.clickPrompt('Opponent');

            // player 1
            expect(this.trashHeap.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.baitAndSwitch.location).toBe('hand');
            expect(this.finishingBlow.location).toBe('hand');
            expect(this.ghostlyHand.location).toBe('hand');
            expect(this.echofly.location).toBe('discard');
            // player 2
            expect(this.bumpsy.location).toBe('discard');
            expect(this.paranormalPalisade.location).toBe('discard');
            expect(this.anger.location).toBe('hand');
            expect(this.barehanded.location).toBe('hand');
            expect(this.bloodMoney.location).toBe('hand');
            expect(this.krump.location).toBe('discard');

            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player2.player.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('refills to less than 6 cards with chains', function () {
            this.player1.chains = 1;
            this.player2.chains = 7;
            this.player1.play(this.trashHeap);
            this.player1.clickPrompt('Me');
            expect(this.player1.player.hand.length).toBe(5);
            expect(this.player2.player.hand.length).toBe(4);
            expect(this.player1.chains).toBe(0);
            expect(this.player2.chains).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Trash Heap with scrap abilities', function () {
        it('does not discard a creature drawn after a revealed creature was discarded', function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['trash-heap', 'brillix-ponder', 'lamindra']
                },
                player2: {}
            });
            this.player1.moveCard(this.lamindra, 'deck');
            this.player1.play(this.trashHeap);
            this.player1.clickPrompt('Me');
            // Scrap Brillix Ponder to draw Lamindra. Lamindra was not
            // revealed and so is not eligible to be discarded.
            expect(this.brillixPonder.location).toBe('discard');
            expect(this.lamindra.location).toBe('hand');
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('lets the active player order scrap discards', function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['trash-heap', 'brillix-ponder', 'hazard-zerp', 'lamindra']
                },
                player2: {}
            });
            this.player1.moveCard(this.lamindra, 'deck');
            this.player1.play(this.trashHeap);
            this.player1.clickPrompt('Me');
            // Scrap Brillix to draw Lamindra, then scrap Zerp to discard Lamindra.
            expect(this.player1).toHavePrompt('Select a card to discard');
            expect(this.player1).toBeAbleToSelect(this.brillixPonder);
            expect(this.player1).toBeAbleToSelect(this.hazardZerp);
            this.player1.clickCard(this.brillixPonder);
            this.player1.clickCard(this.hazardZerp);
            // After both ordering picks, the discards resolve in order.
            // Brillix's scrap draws Lamindra, then Zerp's scrap prompts to
            // discard a card. Note: a card drawn mid-resolution cannot be
            // selected as a further pick — see skipped test below.
            expect(this.brillixPonder.location).toBe('discard');
            expect(this.lamindra.location).toBe('hand');
            this.player1.clickCard(this.lamindra);
            expect(this.brillixPonder.location).toBe('discard');
            expect(this.hazardZerp.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        // SKIPPED: This test documents the desired behavior — that a Scrap
        // effect should resolve after each ordering pick so it can affect
        // subsequent picks (e.g. drawing a new scrappable card to be ordered
        // next, or causing a queued pick to leave the hand). Today the
        // discard-ordering prompt collects all picks first and then resolves
        // the discards (and their Scrap reactions) in one batch, so a card
        // drawn mid-resolution is not offered as a further pick. Re-enable
        // once the engine supports iterative resolution of ordered discards.
        // https://github.com/keyteki/keyteki/issues/4970
        it.skip('resolves each scrap before the next ordering pick', function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['trash-heap', 'brillix-ponder', 'lamindra'],
                    deck: ['hazard-zerp']
                },
                player2: {}
            });
            this.player1.play(this.trashHeap);
            this.player1.clickPrompt('Me');
            // Brillix is the only revealed scrap card initially. After
            // discarding it, its Scrap draws Hazard Zerp — Zerp should then
            // be offered as the next ordered discard, and Zerp's Scrap could
            // discard Lamindra.
            this.player1.clickCard(this.brillixPonder);
            expect(this.brillixPonder.location).toBe('discard');
            expect(this.hazardZerp.location).toBe('hand');
            expect(this.player1).toBeAbleToSelect(this.hazardZerp);
            this.player1.clickCard(this.hazardZerp);
            this.player1.clickCard(this.lamindra);
            expect(this.hazardZerp.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
