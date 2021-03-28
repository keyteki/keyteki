describe('Lethal Distraction', function () {
    describe("Lethal Distraction's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['lethal-distraction', 'whistling-darts'],
                    inPlay: ['dodger', 'umbra']
                },
                player2: {
                    inPlay: ['troll', 'bad-penny']
                }
            });
        });

        it('should cause extra two damage after a fight while defending', function () {
            this.player1.play(this.lethalDistraction);
            this.player1.clickCard(this.troll);
            this.player1.fightWith(this.umbra, this.troll);
            expect(this.troll.tokens.damage).toBe(4);
        });

        it('should cause extra two damage after a fight while attacking', function () {
            this.player1.play(this.lethalDistraction);
            this.player1.clickCard(this.dodger);
            this.player1.fightWith(this.dodger, this.badPenny);
            expect(this.dodger.tokens.damage).toBe(3);
        });

        it('should cause extra two damage after action damage', function () {
            this.player1.play(this.lethalDistraction);
            this.player1.clickCard(this.troll);
            this.player1.play(this.whistlingDarts);
            expect(this.troll.tokens.damage).toBe(3);
        });
    });
});
