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
                'player1 draws 1 card'
            ]);
        });
    });

    describe('reveal both hands', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['cladogenesis', 'troll', 'bumpsy'],
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
                "player1 uses Cladogenesis to discard the top card of each player's deck, reveal each player's hand, and discard cards belonging to each player's discarded card's house",
                "player1 uses Cladogenesis to discard Anger from the top of player1's deck",
                "player1 uses Cladogenesis to discard Nerve Blast from the top of player2's deck",
                "Cladogenesis reveals Troll and Bumpsy from player1's hand",
                "Cladogenesis reveals Krump from player2's hand",
                'player1 uses Cladogenesis to discard Troll and Bumpsy',
                'player1 uses Cladogenesis to have each player refill their hand',
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player2 draws 5 cards to refill their hand to 6 cards'
            ]);
        });
    });
});
