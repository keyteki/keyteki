describe('Foozle', function () {
    describe("Foozle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['bumpsy', 'foozle', 'foozle'],
                    hand: ['punch', 'first-blood']
                },
                player2: {
                    inPlay: ['selwyn-the-fence']
                }
            });
            this.foozleone = this.player1.inPlay[1];
            this.foozletwo = this.player1.inPlay[2];
        });

        it('gain 1 amber by reaping if no creatures have been destroyed', function () {
            this.player1.reap(this.foozleone);
            expect(this.player1.amber).toBe(1);
        });
        it('gain 2 amber by reaping if a creature has been destroyed in a fight', function () {
            this.player1.fightWith(this.bumpsy, this.selwynTheFence);
            this.player1.reap(this.foozleone);
            expect(this.player1.amber).toBe(2);
        });
        it('gain 2 amber by reaping if a creature has been destroyed by direct damage', function () {
            this.player1.play(this.punch);
            this.player1.clickCard(this.selwynTheFence);
            expect(this.selwynTheFence.location).toBe('discard');
            this.player1.reap(this.foozleone);
            expect(this.player1.amber).toBe(3);
        });
        it('gain 2 amber by reaping if a creature has been destroyed by first blood', function () {
            this.player1.play(this.firstBlood);
            this.player1.clickCard(this.selwynTheFence);
            this.player1.clickCard(this.selwynTheFence);
            this.player1.clickCard(this.selwynTheFence);
            this.player1.clickCard(this.foozleone);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.bumpsy);

            this.player1.reap(this.foozleone);
            this.player1.reap(this.foozletwo);

            expect(this.player1.amber).toBe(5);
        });
    });
});
