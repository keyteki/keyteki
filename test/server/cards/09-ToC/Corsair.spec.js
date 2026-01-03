describe('Corsair', function () {
    describe("Corsair's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    token: 'corsair',
                    inPlay: ['corsair:toad', 'bux-bastian']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });

            this.corsair1 = this.player1.player.creaturesInPlay[0];
        });

        it('should do nothing without red key forged', function () {
            this.player1.fightWith(this.corsair1, this.troll);
            expect(this.corsair1.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should give skirmish and +1 power with red key', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.fightWith(this.corsair1, this.troll);
            expect(this.corsair1.location).toBe('play area');
            expect(this.troll.tokens.damage).toBe(3);
            this.player1.fightWith(this.buxBastian, this.troll);
            expect(this.buxBastian.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(6);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
