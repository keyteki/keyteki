describe('Entrench', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'shadows',
                inPlay: ['grammy-taps']
            },
            player2: {
                inPlay: ['bumpsy']
            }
        });

        this.grammyTaps.exhaust();
        this.player1.endTurn();
    });

    it('lets the controller leave Grammy Taps exhausted during their ready phase', function () {
        expect(this.player1).toHavePrompt('Select entrenched creatures to ready');
        this.player1.clickPrompt('done');
        expect(this.grammyTaps.exhausted).toBe(true);
        this.player2.clickPrompt('brobnar');
        expect(this.player2).isReadyToTakeAction();
    });

    it('readies Grammy Taps when selected', function () {
        expect(this.player1).toHavePrompt('Select entrenched creatures to ready');
        this.player1.clickCard(this.grammyTaps);
        this.player1.clickPrompt('done');
        expect(this.grammyTaps.exhausted).toBe(false);
        this.player2.clickPrompt('brobnar');
        expect(this.player2).isReadyToTakeAction();
    });
});
