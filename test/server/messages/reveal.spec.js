describe('Reveal Messages', function () {
    describe('reveal hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['the-visible-hand', 'dextre']
                },
                player2: {}
            });
        });

        it('should log correct message when revealing hand', function () {
            this.player1.play(this.theVisibleHand);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays The Visible Hand',
                'player1 uses The Visible Hand to make 2 token creatures; and reveal Dextre'
            ]);
        });
    });

    describe('reveal each hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['ezra-paws']
                },
                player2: {
                    hand: ['troll', 'krump']
                }
            });
        });

        it("should log opponent's hand contents when revealed", function () {
            this.player1.play(this.ezraPaws);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Ezra Paws',
                'player1 uses Ezra Paws to reveal Troll and Krump',
                'player1 draws 1 card'
            ]);
        });

        it("should not log a reveal line when opponent's hand is empty", function () {
            this.player2.player.hand.forEach((card) => this.player2.moveCard(card, 'discard'));
            this.player1.play(this.ezraPaws);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Ezra Paws',
                'player1 uses Ezra Paws',
                'player1 draws 1 card'
            ]);
        });
    });

    describe('reveal both hands', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['cladogenesis', 'troll'],
                    deck: ['anger']
                },
                player2: {
                    hand: ['krump'],
                    deck: ['nerve-blast']
                }
            });
            this.player1.moveCard('anger', 'deck');
            this.player2.moveCard('nerve-blast', 'deck');
        });

        it("should log reveal lines for each card in both players' hands", function () {
            this.player1.play(this.cladogenesis);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Cladogenesis',
                "player1 gains an amber due to Cladogenesis's bonus icon",
                "player1 uses Cladogenesis to discard Anger and Nerve Blast, reveal each player's hand, and discard cards belonging to each player's discarded card's house",
                'player1 uses Cladogenesis to discard Anger and Nerve Blast',
                'Cladogenesis reveals Troll',
                'Cladogenesis reveals Krump',
                'player1 uses Cladogenesis to discard Troll',
                'player1 uses Cladogenesis to have each player refill their hand',
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player2 draws 5 cards to refill their hand to 6 cards'
            ]);
        });
    });

    describe('Trash Heap reveal messages', function () {
        it("should log both players' revealed hands", function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['trash-heap', 'troll'],
                    inPlay: ['lamindra']
                },
                player2: {
                    hand: ['krump'],
                    inPlay: ['echofly']
                }
            });
            this.player1.play(this.trashHeap);
            this.player1.clickPrompt('Me');
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Trash Heap',
                "player1 uses Trash Heap to destroy each creature, reveal each player's hand, and discard each revealed creature",
                'Lamindra is destroyed',
                'Echofly is destroyed',
                'player1 reveals Troll',
                'player2 reveals Krump',
                'player1 uses Trash Heap to discard Troll',
                'player1 uses Trash Heap to discard Krump',
                'player1 uses Trash Heap to have each player refill their hand',
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player2 draws 6 cards to refill their hand to 6 cards'
            ]);
        });

        it("should log 'reveals nothing' when the active player's hand is empty", function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['trash-heap'],
                    inPlay: ['lamindra']
                },
                player2: {
                    hand: ['krump'],
                    inPlay: ['echofly']
                }
            });
            this.player1.play(this.trashHeap);
            this.player1.clickPrompt('Me');
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Trash Heap',
                "player1 uses Trash Heap to destroy each creature, reveal each player's hand, and discard each revealed creature",
                'Lamindra is destroyed',
                'Echofly is destroyed',
                'player1 reveals nothing',
                'player2 reveals Krump',
                'player1 uses Trash Heap to discard Krump',
                'player1 uses Trash Heap to have each player refill their hand',
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player2 draws 6 cards to refill their hand to 6 cards'
            ]);
        });

        it("should log 'reveals nothing' when the opponent's hand is empty", function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['trash-heap', 'troll'],
                    inPlay: ['lamindra']
                },
                player2: {
                    inPlay: ['echofly']
                }
            });
            this.player2.player.hand.forEach((card) => this.player2.moveCard(card, 'discard'));
            this.player1.play(this.trashHeap);
            this.player1.clickPrompt('Me');
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Trash Heap',
                "player1 uses Trash Heap to destroy each creature, reveal each player's hand, and discard each revealed creature",
                'Lamindra is destroyed',
                'Echofly is destroyed',
                'player1 reveals Troll',
                'player2 reveals nothing',
                'player1 uses Trash Heap to discard Troll',
                'player1 uses Trash Heap to have each player refill their hand',
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player2 draws 6 cards to refill their hand to 6 cards'
            ]);
        });

        it("should log 'reveals nothing' for both when both hands are empty", function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['trash-heap'],
                    inPlay: ['lamindra']
                },
                player2: {
                    inPlay: ['echofly']
                }
            });
            this.player2.player.hand.forEach((card) => this.player2.moveCard(card, 'discard'));
            this.player1.play(this.trashHeap);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Trash Heap',
                "player1 uses Trash Heap to destroy each creature, reveal each player's hand, and discard each revealed creature",
                'Lamindra is destroyed',
                'Echofly is destroyed',
                'player1 reveals nothing',
                'player2 reveals nothing',
                'player1 uses Trash Heap to have each player refill their hand',
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player2 draws 6 cards to refill their hand to 6 cards'
            ]);
        });
    });
});
