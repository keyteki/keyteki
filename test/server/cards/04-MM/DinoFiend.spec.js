describe('Dino-Fiend', function () {
    describe("Dino-Fiend's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['dino-fiend']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('does not deal 3D if not exalted', function () {
            this.player1.play(this.dinoFiend);
            this.player1.clickPrompt('Done');
            expect(this.dinoFiend.amber).toBe(0);
            expect(this.troll.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 3D if exalted', function () {
            this.player1.play(this.dinoFiend);
            this.player1.clickCard(this.dinoFiend);
            this.player1.clickCard(this.troll);
            expect(this.dinoFiend.amber).toBe(1);
            expect(this.troll.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Dino-Fiend's Destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['dino-fiend']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });
        });

        it('steals 1A when destroyed', function () {
            this.player1.fightWith(this.dinoFiend, this.troll);
            expect(this.dinoFiend.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
