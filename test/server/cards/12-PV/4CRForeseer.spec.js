describe('4CR "Foreseer"', function () {
    describe('4CR "Foreseer"\'s ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['4cr-foreseer'],
                    discard: ['searine', 'draining-touch', 'helper-bot']
                },
                player2: {
                    amber: 3,
                    inPlay: ['krump']
                }
            });
            this.player1.moveCard(this.searine, 'deck');
            this.player1.moveCard(this.drainingTouch, 'deck');
            this.player1.moveCard(this.helperBot, 'deck');

            this.fourCRForeseer = this['4crForeseer'];
        });

        it('should allow choosing a card to put in hand when played', function () {
            this.player1.playCreature(this.fourCRForeseer);
            expect(this.player1).toHavePrompt('Choose a card to add to hand');
            expect(this.player1).not.toHavePromptCardButton(this.searine);
            expect(this.player1).toHavePromptCardButton(this.drainingTouch);
            expect(this.player1).toHavePromptCardButton(this.helperBot);
            this.player1.clickPrompt(this.helperBot.name);
            expect(this.searine.location).toBe('deck');
            expect(this.drainingTouch.location).toBe('deck');
            expect(this.helperBot.location).toBe('hand');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow choosing a card to put in hand when reaped', function () {
            this.player1.moveCard(this.fourCRForeseer, 'play area');
            this.fourCRForeseer.exhausted = false;
            this.player1.reap(this.fourCRForeseer);
            expect(this.player1).toHavePrompt('Choose a card to add to hand');
            expect(this.player1).not.toHavePromptCardButton(this.searine);
            expect(this.player1).toHavePromptCardButton(this.drainingTouch);
            expect(this.player1).toHavePromptCardButton(this.helperBot);
            this.player1.clickPrompt(this.helperBot.name);
            expect(this.searine.location).toBe('deck');
            expect(this.drainingTouch.location).toBe('deck');
            expect(this.helperBot.location).toBe('hand');
        });
    });
});
