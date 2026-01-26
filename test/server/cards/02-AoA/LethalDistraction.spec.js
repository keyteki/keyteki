describe('Lethal Distraction', function () {
    describe("Lethal Distraction's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['lethal-distraction', 'whistling-darts'],
                    inPlay: ['dodger', 'umbra', 'urchin']
                },
                player2: {
                    inPlay: ['troll', 'bad-penny', 'groggins', 'drecker']
                }
            });
        });

        it('should cause extra two damage after a fight while defending', function () {
            this.player1.play(this.lethalDistraction);
            this.player1.clickCard(this.troll);
            this.player1.fightWith(this.umbra, this.troll);
            expect(this.troll.damage).toBe(4);
            this.player1.endTurn();
        });

        it('should cause extra two damage after a fight while attacking', function () {
            this.player1.play(this.lethalDistraction);
            this.player1.clickCard(this.dodger);
            this.player1.fightWith(this.dodger, this.badPenny);
            expect(this.dodger.damage).toBe(3);
            this.player1.endTurn();
        });

        it('should cause extra two damage after action damage', function () {
            this.player1.play(this.lethalDistraction);
            this.player1.clickCard(this.troll);
            this.player1.play(this.whistlingDarts);
            expect(this.troll.damage).toBe(3);
            expect(this.groggins.damage).toBe(1);
            this.player1.endTurn();
        });

        it('should last for a single turn', function () {
            this.player1.play(this.lethalDistraction);
            this.player1.clickCard(this.troll);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.play(this.whistlingDarts);
            expect(this.troll.damage).toBe(1);
            expect(this.groggins.damage).toBe(1);
            this.player1.endTurn();
        });

        it('should remove ward and not cause damage', function () {
            this.troll.ward();
            this.player1.play(this.lethalDistraction);
            this.player1.clickCard(this.troll);
            this.player1.play(this.whistlingDarts);
            expect(this.troll.warded).toBe(false);
            expect(this.troll.damage).toBe(0);
            expect(this.groggins.damage).toBe(1);
            this.player1.endTurn();
        });

        it('should deal total damage taken to Drecker', function () {
            this.player1.play(this.lethalDistraction);
            this.player1.clickCard(this.groggins);
            this.player1.fightWith(this.urchin, this.groggins);
            expect(this.groggins.damage).toBe(3);
            expect(this.drecker.damage).toBe(3);
            this.player1.endTurn();
        });
    });
});
