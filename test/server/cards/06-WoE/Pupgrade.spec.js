describe('Pupgrade', function () {
    describe("Pupgrade's creature ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['pupgrade'],
                    inPlay: ['helmsman-spears', 'pelf', 'bumpsy']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should grant abilities', function () {
            this.player1.playUpgrade(this.pupgrade, this.helmsmanSpears);
            expect(this.helmsmanSpears.power).toBe(5);
            this.player1.fightWith(this.helmsmanSpears, this.troll);
            expect(this.helmsmanSpears.location).toBe('discard');
            expect(this.pupgrade.location).toBe('play area');
            expect(this.pupgrade.type).toBe('creature');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1.player.creaturesInPlay[2].name).toBe('Pupgrade');
            this.player1.reap(this.pupgrade);
        });

        it("work on opponent's turn", function () {
            this.player1.playUpgrade(this.pupgrade, this.helmsmanSpears);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.helmsmanSpears);
            expect(this.helmsmanSpears.location).toBe('discard');
            expect(this.pupgrade.location).toBe('play area');
            expect(this.pupgrade.type).toBe('creature');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1.player.creaturesInPlay[2].name).toBe('Pupgrade');
            expect(this.pupgrade.exhausted).toBe(false);
        });
    });
});
