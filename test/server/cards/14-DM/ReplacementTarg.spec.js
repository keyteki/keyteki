describe('Replacement Targ', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'mars',
                amber: 3,
                hand: ['replacement-targ'],
                inPlay: ['iyxrenu-the-clever', 'urchin', 'phylyx-the-disintegrator']
            },
            player2: {
                amber: 5,
                inPlay: ['troll']
            }
        });
    });

    it('returns a non-Soldier neighbor and most powerful friendly captures 2 from opponent', function () {
        this.player1.play(this.replacementTarg, true, true);
        this.player1.clickCard(this.phylyxTheDisintegrator);
        expect(this.player1).toBeAbleToSelect(this.urchin);
        expect(this.player1).not.toBeAbleToSelect(this.phylyxTheDisintegrator);
        expect(this.player1).not.toBeAbleToSelect(this.iyxrenuTheClever);
        expect(this.player1).not.toBeAbleToSelect(this.replacementTarg);
        expect(this.player1).not.toBeAbleToSelect(this.troll);
        this.player1.clickCard(this.urchin);
        expect(this.urchin.location).toBe('hand');
        expect(this.player1).toBeAbleToSelect(this.iyxrenuTheClever);
        expect(this.player1).toBeAbleToSelect(this.replacementTarg);
        expect(this.player1).not.toBeAbleToSelect(this.phylyxTheDisintegrator);
        expect(this.player1).not.toBeAbleToSelect(this.troll);
        this.player1.clickCard(this.iyxrenuTheClever);
        expect(this.iyxrenuTheClever.amber).toBe(2);
        expect(this.player2.amber).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot select a neighboring Soldier', function () {
        this.player1.play(this.replacementTarg, true, true);
        this.player1.clickCard(this.phylyxTheDisintegrator);
        expect(this.player1).not.toBeAbleToSelect(this.phylyxTheDisintegrator);
        this.player1.clickCard(this.urchin);
        this.player1.clickCard(this.iyxrenuTheClever);
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot select a non-neighboring non-Soldier creature', function () {
        this.player1.play(this.replacementTarg, true, true);
        this.player1.clickCard(this.phylyxTheDisintegrator);
        expect(this.player1).not.toBeAbleToSelect(this.iyxrenuTheClever);
        this.player1.clickCard(this.urchin);
        this.player1.clickCard(this.iyxrenuTheClever);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not capture if no neighbor can be selected', function () {
        this.player1.play(this.replacementTarg);
        expect(this.replacementTarg.location).toBe('play area');
        expect(this.iyxrenuTheClever.amber).toBe(0);
        expect(this.urchin.amber).toBe(0);
        expect(this.phylyxTheDisintegrator.amber).toBe(0);
        expect(this.replacementTarg.amber).toBe(0);
        expect(this.player2.amber).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
