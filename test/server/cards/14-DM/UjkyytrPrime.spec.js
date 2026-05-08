describe('Ujkyytr Prime', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'mars',
                inPlay: ['ujkyytr-prime', 'iyxrenu-the-clever', 'john-smyth']
            },
            player2: {
                inPlay: ['troll', 'bumpsy', 'krump', 'urchin']
            }
        });
    });

    it('stuns only the chosen enemy when not overwhelmed', function () {
        this.player2.moveCard(this.urchin, 'discard');
        expect(this.player1.player.isOverwhelmed()).toBe(false);

        this.player1.reap(this.ujkyytrPrime);
        expect(this.player1).toBeAbleToSelect(this.ujkyytrPrime);
        expect(this.player1).toBeAbleToSelect(this.iyxrenuTheClever);
        expect(this.player1).toBeAbleToSelect(this.johnSmyth);
        expect(this.player1).toBeAbleToSelect(this.troll);
        expect(this.player1).toBeAbleToSelect(this.bumpsy);
        this.player1.clickCard(this.troll);

        expect(this.ujkyytrPrime.stunned).toBe(false);
        expect(this.iyxrenuTheClever.stunned).toBe(false);
        expect(this.johnSmyth.stunned).toBe(false);
        expect(this.troll.stunned).toBe(true);
        expect(this.bumpsy.stunned).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    it('stuns target enemy and its neighbors when overwhelmed, leaving non-neighbors alone', function () {
        expect(this.player1.player.isOverwhelmed()).toBe(true);
        this.player1.reap(this.ujkyytrPrime);
        expect(this.player1).not.toBeAbleToSelect(this.ujkyytrPrime);
        expect(this.player1).not.toBeAbleToSelect(this.iyxrenuTheClever);
        expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
        expect(this.player1).toBeAbleToSelect(this.troll);
        expect(this.player1).toBeAbleToSelect(this.bumpsy);
        expect(this.player1).toBeAbleToSelect(this.krump);
        expect(this.player1).toBeAbleToSelect(this.urchin);
        this.player1.clickCard(this.bumpsy);
        expect(this.ujkyytrPrime.stunned).toBe(false);
        expect(this.iyxrenuTheClever.stunned).toBe(false);
        expect(this.johnSmyth.stunned).toBe(false);
        expect(this.bumpsy.stunned).toBe(true);
        expect(this.troll.stunned).toBe(true);
        expect(this.krump.stunned).toBe(true);
        expect(this.urchin.stunned).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
