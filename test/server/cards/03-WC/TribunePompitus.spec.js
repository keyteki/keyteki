describe('Tribune Pompitus', function () {
    describe("Tribune Pompitus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['tribune-pompitus', 'questor-jarta', 'senator-shrix'],
                    hand: []
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should give +2 power per amber on friendly creatures', function () {
            expect(this.tribunePompitus.power).toBe(4);
            expect(this.questorJarta.power).toBe(3);
            expect(this.senatorShrix.power).toBe(4);
            expect(this.troll.power).toBe(8);
            expect(this.krump.power).toBe(6);

            this.tribunePompitus.tokens.amber = 1;
            this.questorJarta.tokens.amber = 2;
            this.senatorShrix.tokens.amber = 3;
            this.troll.tokens.amber = 4;

            this.player1.reap(this.tribunePompitus);

            expect(this.tribunePompitus.power).toBe(6);
            expect(this.questorJarta.power).toBe(7);
            expect(this.senatorShrix.power).toBe(10);
            expect(this.troll.power).toBe(8);
            expect(this.krump.power).toBe(6);
        });

        it('should give an option to exalt itself before fight and allow cancel', function () {
            this.player1.fightWith(this.tribunePompitus, this.krump);
            expect(this.player1).toHavePrompt('Any interrupts?');
            this.player1.clickPrompt('Done');
            expect(this.tribunePompitus.location).toBe('discard');
            expect(this.krump.tokens.damage).toBe(4);
        });

        it('should give an option to exalt itself before fight', function () {
            this.player1.fightWith(this.tribunePompitus, this.krump);
            expect(this.player1).toHavePrompt('Any interrupts?');
            this.player1.clickCard(this.tribunePompitus);
            expect(this.tribunePompitus.power).toBe(6);
            expect(this.tribunePompitus.tokens.damage).toBe(4);
            expect(this.krump.location).toBe('discard');
        });
    });
});
