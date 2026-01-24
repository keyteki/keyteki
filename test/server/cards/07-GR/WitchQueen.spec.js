describe('Witch Queen', function () {
    describe("Witch Queen's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['witch-queen', 'hunting-witch', 'tantadlin'],
                    inPlay: ['dharna']
                },
                player2: {
                    inPlay: ['troll'],
                    hand: ['witch-of-the-eye', 'berserker-slam']
                }
            });
        });

        it('causes friendly witches to enter play ready', function () {
            this.player1.playCreature(this.witchQueen);
            expect(this.witchQueen.exhausted).toBe(true);
            this.player1.playCreature(this.huntingWitch);
            expect(this.huntingWitch.exhausted).toBe(false);
            this.player1.reap(this.huntingWitch);
            this.player1.playCreature(this.tantadlin);
            expect(this.tantadlin.exhausted).toBe(true);
        });

        it('does not apply to enemy witches', function () {
            this.player1.playCreature(this.witchQueen);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.witchOfTheEye);
            expect(this.witchOfTheEye.exhausted).toBe(true);
        });

        it('causes friendly witches to gain elusive while in center', function () {
            this.player1.playCreature(this.witchQueen);
            this.player1.playCreature(this.huntingWitch);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.dharna);
            expect(this.troll.damage).toBe(0);
            expect(this.dharna.location).toBe('play area');
        });

        it('does not grant elusive while not in center', function () {
            this.player1.playCreature(this.witchQueen);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.dharna);
            expect(this.troll.damage).toBe(2);
            expect(this.dharna.location).toBe('discard');
        });

        it('causes friendly witches to gain skirmish and poison while in center', function () {
            this.player1.playCreature(this.witchQueen);
            this.player1.playCreature(this.huntingWitch);
            this.player1.fightWith(this.dharna, this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.dharna.location).toBe('play area');
            expect(this.dharna.damage).toBe(0);
        });

        it('does not grant skirmish and poison while not in center', function () {
            this.player1.playCreature(this.witchQueen);
            this.player1.fightWith(this.dharna, this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.damage).toBe(2);
            expect(this.dharna.location).toBe('discard');
        });

        it('causes friendly witches to gain destroyed ability while in center', function () {
            this.player1.playCreature(this.witchQueen);
            this.player1.playCreature(this.huntingWitch);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.berserkerSlam);
            this.player2.clickCard(this.dharna);
            expect(this.dharna.location).toBe('hand');
        });
    });
});
