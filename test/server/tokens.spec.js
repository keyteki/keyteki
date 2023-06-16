describe('Token', function () {
    describe("'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'prospector',
                    hand: [
                        'hire-on',
                        'generous-offer',
                        'forced-retirement',
                        'antiquities-dealer',
                        'dthoshră-recruiter'
                    ]
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should prompt placement with the name of the token', function () {
            this.player1.moveCard(this.antiquitiesDealer, 'deck');
            this.player1.playCreature(this.dthoshrăRecruiter);
            this.player1.play(this.hireOn);
            expect(this.player1).toHavePrompt('Prospector');
            expect(this.player1).toHavePromptImage('prospector');
            this.player1.clickPrompt('Left');
        });

        it('should lose token abilities after destroyed', function () {
            let token = this.antiquitiesDealer;
            this.player1.moveCard(token, 'deck');
            this.player1.play(this.hireOn, true);
            expect(token.name).toBe('Prospector');
            expect(token.location).toBe('play area');

            // Destroy the token, draw a card.
            let handSize = this.player1.hand.length;
            this.player1.play(this.generousOffer);
            this.player1.clickCard(token);
            expect(this.player1.hand.length).toBe(handSize - 1 + 1);
            expect(token.location).toBe('discard');

            // Replay as a regular creature.
            this.player1.moveCard(token, 'hand');
            this.player1.playCreature(token);
            expect(token.name).toBe('Antiquities Dealer');
            expect(token.location).toBe('play area');

            // Destroy it again, no draw this time.
            handSize = this.player1.hand.length;
            this.player1.play(this.forcedRetirement);
            this.player1.clickCard(token);
            expect(token.location).toBe('discard');
            expect(this.player1.hand.length).toBe(handSize - 1);
        });
    });
});
