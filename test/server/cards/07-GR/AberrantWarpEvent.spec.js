describe('AberrantWarpEvent', function () {
    describe('is played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: [
                        'aberrant-warp-event',
                        'the-warchest',
                        'anger',
                        'blood-of-titans',
                        'ganger-chieftain',
                        'urchin'
                    ],
                    inPlay: ['dodger']
                },
                player2: {
                    hand: [
                        'causal-loop',
                        'static-charge',
                        'crazy-killing-machine',
                        'daughter',
                        'gub'
                    ],
                    inPlay: ['mother']
                }
            });
        });

        it('plays with creatures in both decks', function () {
            this.player1.moveCard(this.urchin, 'deck');
            this.player1.moveCard(this.gangerChieftain, 'deck');
            this.player1.moveCard(this.anger, 'deck');
            this.player1.moveCard(this.bloodOfTitans, 'deck');
            this.player1.moveCard(this.theWarchest, 'deck');

            this.player2.moveCard(this.gub, 'deck');
            this.player2.moveCard(this.daughter, 'deck');
            this.player2.moveCard(this.crazyKillingMachine, 'deck');
            this.player2.moveCard(this.staticCharge, 'deck');
            this.player2.moveCard(this.causalLoop, 'deck');

            // Self
            this.player1.play(this.aberrantWarpEvent);
            expect(this.player1).toHavePrompt('Which flank do you want to place this creature on?');
            this.player1.clickPrompt('Left');
            expect(this.urchin.location).toBe('deck');
            expect(this.anger.location).toBe('discard');
            expect(this.bloodOfTitans.location).toBe('discard');
            expect(this.theWarchest.location).toBe('discard');
            expect(this.gangerChieftain.location).toBe('play area');
            expect(this.dodger.location).toBe('discard');

            // Opponent
            expect(this.player1).toHavePrompt('Which flank do you want to place this creature on?');
            this.player1.clickPrompt('Left');
            expect(this.gub.location).toBe('deck');
            expect(this.causalLoop.location).toBe('discard');
            expect(this.staticCharge.location).toBe('discard');
            expect(this.crazyKillingMachine.location).toBe('discard');
            expect(this.daughter.location).toBe('play area');
            expect(this.mother.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('plays with creatures only in opponent deck', function () {
            this.player1.moveCard(this.anger, 'deck');
            this.player1.moveCard(this.bloodOfTitans, 'deck');
            this.player1.moveCard(this.theWarchest, 'deck');

            this.player2.moveCard(this.gub, 'deck');
            this.player2.moveCard(this.daughter, 'deck');
            this.player2.moveCard(this.crazyKillingMachine, 'deck');
            this.player2.moveCard(this.staticCharge, 'deck');
            this.player2.moveCard(this.causalLoop, 'deck');

            // Self
            this.player1.play(this.aberrantWarpEvent);
            expect(this.urchin.location).toBe('hand');
            expect(this.anger.location).toBe('discard');
            expect(this.bloodOfTitans.location).toBe('discard');
            expect(this.theWarchest.location).toBe('discard');
            expect(this.gangerChieftain.location).toBe('hand');
            expect(this.dodger.location).toBe('play area');

            // Opponent
            expect(this.gub.location).toBe('deck');
            expect(this.causalLoop.location).toBe('discard');
            expect(this.staticCharge.location).toBe('discard');
            expect(this.crazyKillingMachine.location).toBe('discard');
            expect(this.daughter.location).toBe('play area');
            expect(this.mother.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
