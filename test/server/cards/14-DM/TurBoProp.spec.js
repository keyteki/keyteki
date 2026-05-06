describe('Tur-Bo Prop', function () {
    describe('Tur-Bo Prop when no blue key is forged', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['tur-bo-prop'],
                    deck: ['troll', 'krump', 'bumpsy']
                },
                player2: {}
            });
        });

        it('draws 1 card on reap', function () {
            const handBefore = this.player1.hand.length;
            this.player1.reap(this.turBoProp);
            expect(this.player1.hand.length).toBe(handBefore + 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Tur-Bo Prop when player has forged blue key', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['tur-bo-prop'],
                    deck: ['troll', 'krump', 'bumpsy']
                },
                player2: {}
            });
            this.player1.player.keys.blue = true;
        });

        it('draws 2 cards on reap', function () {
            const handBefore = this.player1.hand.length;
            this.player1.reap(this.turBoProp);
            expect(this.player1.hand.length).toBe(handBefore + 2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Tur-Bo Prop when opponent has forged blue key', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['tur-bo-prop'],
                    deck: ['troll', 'krump', 'bumpsy']
                },
                player2: {}
            });
            this.player2.player.keys.blue = true;
        });

        it('draws 2 cards on reap', function () {
            const handBefore = this.player1.hand.length;
            this.player1.reap(this.turBoProp);
            expect(this.player1.hand.length).toBe(handBefore + 2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
