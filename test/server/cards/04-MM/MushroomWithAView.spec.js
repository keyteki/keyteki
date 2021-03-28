describe('Mushroom with a View', function () {
    describe("Mushroom with a View's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['envy', 'pride', 'mushroom-with-a-view', 'troll', 'shooler']
                },
                player2: {
                    inPlay: ['desire', 'dust-imp', 'culf-the-quiet']
                }
            });
        });

        it('should heal 1 from all friendly creatures', function () {
            this.envy.tokens.damage = 2;
            this.pride.tokens.damage = 1;
            this.troll.tokens.damage = 1;
            this.desire.tokens.damage = 2;

            this.player1.useAction(this.mushroomWithAView, true);

            expect(this.envy.tokens.damage).toBe(1);
            expect(this.pride.tokens.damage).toBeUndefined();
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.shooler.tokens.damage).toBeUndefined();

            expect(this.desire.tokens.damage).toBe(2);
            expect(this.culfTheQuiet.tokens.damage).toBeUndefined();
        });
    });
});
