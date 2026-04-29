describe('Reduce, Reuse', function () {
    describe('Reduce, Reuse when haunted', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['reduce-reuse']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
            // Make player1 haunted
            for (let i = 0; i < 10; i++) {
                this.player1.moveCard(this.player1.player.deck[0], 'discard');
            }
        });

        it('deals 5 damage to a creature', function () {
            expect(this.player1.player.isHaunted()).toBe(true);
            this.player1.play(this.reduceReuse);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.troll);
            // Troll has 6 power -> takes 5 damage, survives
            expect(this.troll.damage).toBe(5);
            expect(this.troll.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('destroys a creature with 5 or less power', function () {
            this.player1.play(this.reduceReuse);
            this.player1.clickCard(this.bumpsy);
            // Bumpsy has 2 power -> destroyed by 5 damage
            expect(this.bumpsy.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Reduce, Reuse when not haunted', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['reduce-reuse']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('returns a creature to its owner hand', function () {
            expect(this.player1.player.isHaunted()).toBe(false);
            this.player1.play(this.reduceReuse);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            expect(this.troll.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
