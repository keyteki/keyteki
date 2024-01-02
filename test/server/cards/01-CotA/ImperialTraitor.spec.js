describe('Imperial Traitor', function () {
    describe("Imperial Traitor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['firespitter'],
                    hand: ['imperial-traitor']
                },
                player2: {
                    hand: ['shadow-self', 'nexus', 'sequis', 'commander-remiel', 'umbra']
                }
            });
            this.player1.play(this.imperialTraitor);
        });

        it("should reveal opponent's hand on play", function () {
            expect(this.player1).not.toBeAbleToSelect(this.shadowSelf);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            checkVisibility(this.player2, this.player1, true);
            checkVisibility(this.player2, this.player2, true);
            expect(this.player1).toHavePromptButton('Done');
        });

        describe('and not select a sanctum card', function () {
            it('when click Done', function () {
                this.player1.clickPrompt('Done');
                checkVisibility(this.player2, this.player1, false);
                checkVisibility(this.player2, this.player2, true);
                this.player1.endTurn();
            });
        });

        describe('and select a sanctum card to purge', function () {
            it('when click Done', function () {
                this.player1.clickCard(this.sequis);
                this.player1.clickPrompt('Done');
                expect(this.sequis.location).toBe('purged');
                checkVisibility(this.player2, this.player1, false);
                checkVisibility(this.player2, this.player2, true);
                this.player1.endTurn();
            });
        });
    });

    describe("Imperial Traitor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['firespitter'],
                    hand: ['imperial-traitor']
                },
                player2: {
                    hand: ['shadow-self', 'nexus', 'flaxia', 'umbra'],
                    inPlay: ['sequis']
                }
            });
        });

        it("should still reveal opponent's hand when there is no sanctum card", function () {
            this.player1.play(this.imperialTraitor);
            expect(this.player1).not.toBeAbleToSelect(this.shadowSelf);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            expect(this.player1).toHavePromptButton('Done');

            checkVisibility(this.player2, this.player1, true);
            checkVisibility(this.player2, this.player2, true);

            this.player1.clickPrompt('Done');
            checkVisibility(this.player2, this.player1, false);
            checkVisibility(this.player2, this.player2, true);
            this.player1.endTurn();
        });
    });

    function checkVisibility(handPlayer, seeingPlayer, expected) {
        expect(
            handPlayer.player.hand.every(
                (c) => !c.getSummary(seeingPlayer.player).facedown === expected
            )
        ).toBe(true);
    }
});
