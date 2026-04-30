describe('Productive Trash', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'mars',
                hand: ['productive-trash', 'urchin'],
                inPlay: ['john-smyth', 'iyxrenu-the-clever']
            },
            player2: {
                amber: 5,
                inPlay: ['troll']
            }
        });
    });

    it('captures 1 per bonus icon on the discarded card from the opponent', function () {
        this.urchin.enhancements = ['amber', 'amber'];
        this.player1.play(this.productiveTrash);
        this.player1.clickCard(this.urchin);
        expect(this.urchin.location).toBe('discard');
        expect(this.player1).toBeAbleToSelect(this.johnSmyth);
        expect(this.player1).toBeAbleToSelect(this.iyxrenuTheClever);
        expect(this.player1).not.toBeAbleToSelect(this.troll);
        this.player1.clickCard(this.johnSmyth);
        this.player1.clickCard(this.johnSmyth);
        expect(this.johnSmyth.amber).toBe(2);
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });

    it('allows splitting captures across different friendly creatures', function () {
        this.urchin.enhancements = ['amber', 'amber'];
        this.player1.play(this.productiveTrash);
        this.player1.clickCard(this.urchin);
        this.player1.clickCard(this.johnSmyth);
        this.player1.clickCard(this.iyxrenuTheClever);
        expect(this.johnSmyth.amber).toBe(1);
        expect(this.iyxrenuTheClever.amber).toBe(1);
        expect(this.player2.amber).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });

    it('may decline to discard', function () {
        this.urchin.enhancements = ['amber', 'amber'];
        this.player1.play(this.productiveTrash);
        this.player1.clickPrompt('Done');
        expect(this.urchin.location).toBe('hand');
        expect(this.johnSmyth.amber).toBe(0);
        expect(this.player2.amber).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not capture if the discarded card has no bonus icons', function () {
        this.player1.play(this.productiveTrash);
        this.player1.clickCard(this.urchin);
        expect(this.urchin.location).toBe('discard');
        expect(this.johnSmyth.amber).toBe(0);
        expect(this.iyxrenuTheClever.amber).toBe(0);
        expect(this.player2.amber).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });

    it('counts draw, discard, capture and power bonus icons', function () {
        this.urchin.enhancements = ['draw', 'discard', 'capture', 'power'];
        this.player1.play(this.productiveTrash);
        this.player1.clickCard(this.urchin);
        this.player1.clickCard(this.johnSmyth);
        this.player1.clickCard(this.johnSmyth);
        this.player1.clickCard(this.johnSmyth);
        this.player1.clickCard(this.johnSmyth);
        expect(this.johnSmyth.amber).toBe(4);
        expect(this.player2.amber).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('counts house bonus icons as bonus icons', function () {
        this.urchin.enhancements = ['brobnar'];
        this.player1.play(this.productiveTrash);
        this.player1.clickCard(this.urchin);
        this.player1.clickCard(this.johnSmyth);
        expect(this.johnSmyth.amber).toBe(1);
        expect(this.player2.amber).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
