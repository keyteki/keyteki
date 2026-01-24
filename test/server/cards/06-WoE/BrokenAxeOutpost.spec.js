describe('Broken Axe Outpost', function () {
    describe("Broken Axe Outpost's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['bumpsy', 'broken-axe-outpost']
                },
                player2: {
                    inPlay: ['selwyn-the-fence', 'kelifi-dragon']
                }
            });
        });

        it('put a creature on the bottom of your deck and kill a small enemy creature', function () {
            this.player1.useAction(this.brokenAxeOutpost);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.selwynTheFence);
            this.player2.player.deck = [];
            expect(this.bumpsy.location).toBe('deck');
            expect(this.selwynTheFence.location).toBe('discard');
        });

        it('put a creature on the bottom of your deck and damage a big enemy creature', function () {
            let bottom = this.player1.player.deck.length;
            this.player1.useAction(this.brokenAxeOutpost);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.kelifiDragon);
            expect(this.bumpsy.location).toBe('deck');
            expect(this.player1.player.deck[bottom]).toBe(this.bumpsy);
            expect(this.kelifiDragon.damage).toBe(6);
        });

        it('should fizzle with no creatures in play', function () {
            this.player1.fightWith(this.bumpsy, this.kelifiDragon);
            this.player1.useAction(this.brokenAxeOutpost);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
