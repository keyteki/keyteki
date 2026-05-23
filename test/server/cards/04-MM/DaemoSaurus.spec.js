describe('Dæmo-Saurus', function () {
    describe("Dæmo-Saurus's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['dæmo-saurus']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('does not deal 3D if not exalted', function () {
            this.player1.play(this.dæmoSaurus);
            this.player1.clickPrompt('Done');
            expect(this.dæmoSaurus.amber).toBe(0);
            expect(this.troll.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 3D if exalted', function () {
            this.player1.play(this.dæmoSaurus);
            this.player1.clickCard(this.dæmoSaurus);
            this.player1.clickCard(this.troll);
            expect(this.dæmoSaurus.amber).toBe(1);
            expect(this.troll.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Dæmo-Saurus's Destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['dæmo-saurus']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });
        });

        it('steals 1A when destroyed', function () {
            this.player1.fightWith(this.dæmoSaurus, this.troll);
            expect(this.dæmoSaurus.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
