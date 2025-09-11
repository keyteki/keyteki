describe('Abduct-o-matic', function () {
    describe('fight ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['abduct-o-matic'],
                    hand: ['blypyp'],
                    discard: new Array(9).fill('poke') // not haunted
                },
                player2: {
                    amber: 3,
                    inPlay: ['urchin']
                }
            });
        });

        it('does not capture while not haunted', function () {
            this.player1.fightWith(this.abductOMatic, this.urchin);
            expect(this.player2.amber).toBe(3);
        });

        it('does capture while haunted', function () {
            this.player1.clickCard(this.blypyp); // haunted
            this.player1.clickPrompt('Discard this card');
            this.player1.fightWith(this.abductOMatic, this.urchin);
            expect(this.player2.amber).toBe(1);
            expect(this.abductOMatic.amber).toBe(2);
        });
    });

    describe('scrap ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['blypyp', 'chuff-ape', 'mindwarper'],
                    hand: ['abduct-o-matic', 'abduct-o-matic']
                },
                player2: {
                    amber: 3,
                    inPlay: ['urchin']
                }
            });
        });

        it('captures onto least powerful friendly creature', function () {
            this.player1.scrap(this.abductOMatic);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toBeAbleToSelect(this.chuffApe);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            this.player1.clickCard('Blypyp');
            expect(this.player2.amber).toBe(1);
            expect(this.chuffApe.amber).toBe(0);
            expect(this.blypyp.amber).toBe(2);
            expect(this.urchin.amber).toBe(0);

            this.abductomatic2 = this.player1.findCardByName('abduct-o-matic', 'hand');
            this.player1.scrap(this.abductomatic2);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard('Mindwarper');
            expect(this.player2.amber).toBe(0);
            expect(this.blypyp.amber).toBe(2);
            expect(this.mindwarper.amber).toBe(1);
        });
    });
});
