describe('Harbinger of Doom', function () {
    describe("Harbinger of Doom's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['harbinger-of-doom', 'spyyyder', 'rustgnawer']
                },
                player2: {
                    amber: 2,
                    inPlay: ['brain-eater', 'batdrone', 'mother'],
                    hand: ['remote-access']
                }
            });
        });
        it("should clear the board when it's destroyed", function () {
            this.player1.fightWith(this.harbingerOfDoom, this.mother);
            expect(this.harbingerOfDoom.location).toBe('discard');
            expect(this.spyyyder.location).toBe('discard');
            expect(this.rustgnawer.location).toBe('discard');
            expect(this.brainEater.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            expect(this.mother.location).toBe('discard');
        });
    });

    describe('2 Harbinger of Doom and a warded creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['mindwarper'],
                    hand: ['gateway-to-dis']
                },
                player2: {
                    inPlay: ['harbinger-of-doom', 'harbinger-of-doom']
                }
            });
            this.mindwarper.ward();
            this.game.checkGameState(true);
            this.harbingerOfDoom2 = this.player2.inPlay[1];
        });

        it('should destroy all creatures', function () {
            this.player1.play(this.gatewayToDis);
            this.player1.clickCard(this.harbingerOfDoom);

            expect(this.mindwarper.location).toBe('discard');
            expect(this.harbingerOfDoom.location).toBe('discard');
            expect(this.harbingerOfDoom2.location).toBe('discard');
        });
    });
});
