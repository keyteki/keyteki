describe('Reduce, Reuse', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'geistoid',
                hand: ['reduce-reuse'],
                inPlay: ['echofly', 'lamindra']
            },
            player2: {
                inPlay: ['troll', 'bumpsy']
            }
        });
    });

    it('deals 5 damage to a creature when haunted', function () {
        for (let i = 0; i < 10; i++) {
            this.player1.moveCard(this.player1.player.deck[0], 'discard');
        }
        expect(this.player1.player.isHaunted()).toBe(true);
        this.player1.play(this.reduceReuse);
        expect(this.player1).toBeAbleToSelect(this.echofly);
        expect(this.player1).toBeAbleToSelect(this.lamindra);
        expect(this.player1).toBeAbleToSelect(this.troll);
        expect(this.player1).toBeAbleToSelect(this.bumpsy);
        this.player1.clickCard(this.troll);
        expect(this.troll.damage).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });

    it('returns a creature to its owner hand when not haunted', function () {
        expect(this.player1.player.isHaunted()).toBe(false);
        this.player1.play(this.reduceReuse);
        expect(this.player1).toBeAbleToSelect(this.echofly);
        expect(this.player1).toBeAbleToSelect(this.lamindra);
        expect(this.player1).toBeAbleToSelect(this.troll);
        expect(this.player1).toBeAbleToSelect(this.bumpsy);
        this.player1.clickCard(this.troll);
        expect(this.troll.location).toBe('hand');
        expect(this.troll.controller).toBe(this.player2.player);
        expect(this.player1).isReadyToTakeAction();
    });
});
