describe('Disabled Security', function () {
    describe("Disabled Security's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['disabled-security'],
                    inPlay: ['umbra']
                },
                player2: {
                    amber: 4,
                    inPlay: ['witch-of-the-eye'],
                    discard: [
                        'urchin',
                        'hunting-witch',
                        'dust-pixie',
                        'krump',
                        'persistence-hunting'
                    ]
                }
            });

            this.player2.moveCard(this.urchin, 'deck');
            this.player2.moveCard(this.huntingWitch, 'deck');
            this.player2.moveCard(this.krump, 'deck');
        });

        it("should play a card from opponent's discarded cards", function () {
            this.player1.play(this.disabledSecurity);
            expect(this.urchin.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Right');
            expect(this.krump.location).toBe('play area');
            expect(this.krump.controller).toBe(this.player1.player);
            this.expectReadyToTakeAction(this.player1);
        });

        it("should play action card from opponent's discarded cards", function () {
            this.player2.moveCard(this.persistenceHunting, 'deck');
            this.player1.play(this.disabledSecurity);
            this.player1.clickCard(this.persistenceHunting);
            this.player1.clickPrompt('untamed');
            expect(this.witchOfTheEye.exhausted).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not play a card if opponent has no cards in deck', function () {
            this.player2.player.deck = [];
            this.player1.play(this.disabledSecurity);
            expect(this.player2.player.discard.length).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should play a card if opponent has less than 3 cards in deck', function () {
            this.player2.player.deck = [this.krump, this.huntingWitch];
            this.player1.play(this.disabledSecurity);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Right');
            expect(this.krump.location).toBe('play area');
            expect(this.krump.controller).toBe(this.player1.player);
            expect(this.player2.player.discard.length).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
