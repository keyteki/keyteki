describe('Archive Messages', function () {
    describe('archive from hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['information-officer-gray', 'troll']
                },
                player2: {}
            });
        });

        it('should log correct message when archiving a card', function () {
            this.player1.play(this.informationOfficerGray);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Information Officer Gray',
                'player1 uses Information Officer Gray to reveal Troll from their hand, and archive it'
            ]);
        });
    });

    describe('archive from deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['zyx-researcher'],
                    deck: ['troll']
                },
                player2: {}
            });
        });

        it('should log correct message when archiving from deck', function () {
            this.player1.play(this.zyxResearcher);
            this.player1.clickPrompt('Deck');
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Z.Y.X. Researcher',
                "player1 chooses option 'Deck'",
                'player1 uses Z.Y.X. Researcher to archive a card'
            ]);
        });
    });

    describe('archive from discard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['novu-archaeologist'],
                    discard: ['troll']
                },
                player2: {}
            });
        });

        it('should log correct message when archiving from discard', function () {
            this.player1.useAction(this.novuArchaeologist);
            this.player1.clickCard(this.troll);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Novu Archaeologist to archive Troll'
            ]);
        });
    });

    describe('reveal and discard from archives', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['barter-and-games'],
                    archives: ['troll']
                },
                player2: {
                    hand: ['anger']
                }
            });
        });

        it('should log correct messages when revealing and discarding from archives', function () {
            this.player1.play(this.barterAndGames);
            this.player1.clickPrompt('My Archives');
            this.player1.clickPrompt("Opponent's Hand");
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Barter and Games',
                "player1 chooses option 'My Archives'",
                'player1 uses Barter and Games to reveal a card',
                'Barter and Games reveals Troll',
                "player1 chooses option 'Opponent's Hand'",
                'Barter and Games reveals Anger',
                'player1 uses Barter and Games to gain 0 amber, cause player2 to gain 1 amber, destroy creatures sharing a house with the revealed cards, and discard the revealed cards',
                'player1 uses Barter and Games to discard Anger and Troll'
            ]);
        });
    });

    describe('discard single card from archive', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['novu-dynamo'],
                    archives: ['dextre']
                },
                player2: {
                    hand: ['foggify']
                }
            });
        });

        it('should log correct message when discarding a card from archive', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickCard(this.dextre);
            expect(this).toHaveAllChatMessagesBe([
                'player1 readies their cards',
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 does not forge a key.  They have 0 amber.  The current cost is 6 amber',
                'player2 chooses logos as their active house this turn',
                'player2 draws 5 cards to refill their hand to 6 cards',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player1 uses Novu Dynamo to discard Dextre and gain 1 amber',
                'player1 uses Novu Dynamo to discard Dextre',
                'player1 does not forge a key.  They have 1 amber.  The current cost is 6 amber'
            ]);
        });
    });

    describe('discard whole archive', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['dysania']
                },
                player2: {
                    archives: ['troll', 'ember-imp', 'punch']
                }
            });
        });

        it('should log correct message when discarding opponents archives', function () {
            this.player1.play(this.dysania);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Dysania',
                "player1 uses Dysania to discard all cards in player2's archives, and gain 3 amber",
                'player1 uses Dysania to discard Troll, Ember Imp, and Punch'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
