describe('Psychic Bug', function () {
    describe("Psychic Bug's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['firespitter'],
                    hand: ['psychic-bug']
                },
                player2: {
                    hand: ['shadow-self', 'nexus', 'sequis', 'commander-remiel', 'umbra']
                }
            });
        });

        it("should reveal opponent's hand on play", function () {
            this.player1.play(this.psychicBug);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Psychic Bug to reveal Shadow Self, Nexus, Sequis, Commander Remiel, and Umbra'
            );
            this.player1.endTurn();
        });
    });

    describe("Psychic Bug's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['firespitter'],
                    hand: ['psychic-bug']
                },
                player2: {
                    inPlay: ['shadow-self', 'nexus', 'sequis', 'flaxia', 'umbra'],
                    hand: []
                }
            });
        });

        it("should do nothing if opponent's hand is empty", function () {
            this.player1.play(this.psychicBug);
            expect(this).toHaveRecentChatMessage(
                "player1 gains an amber due to Psychic Bug's bonus icon"
            );
            this.player1.endTurn();
        });
    });
});
