describe('Harvest Time', function () {
    describe('play ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'dis',
                    hand: ['harvest-time', 'collar-of-subordination'],
                    inPlay: ['gamgee', 'bad-penny', 'troll']
                },
                player2: {
                    amber: 2,
                    inPlay: ['knuckles-bolton', 'pip-pip', 'lamindra']
                }
            });

            this.player1.playUpgrade(this.collarOfSubordination, this.lamindra);
            this.player1.clickPrompt('left');
        });

        describe('when the card is played', function () {
            beforeEach(function () {
                this.player1.play(this.harvestTime);
            });

            it('should prompt for a trait', function () {
                expect(this.player1).toHavePrompt('Name a trait');
            });

            describe('when a trait is selected', function () {
                beforeEach(function () {
                    this.player1.selectTrait('thief');
                });

                it('should purge all creatures with that trait', function () {
                    expect(this.gamgee.location).toBe('purged');
                    expect(this.badPenny.location).toBe('purged');
                    expect(this.lamindra.location).toBe('purged');
                    expect(this.knucklesBolton.location).toBe('purged');
                    expect(this.troll.location).not.toBe('purged');
                    expect(this.pipPip.location).not.toBe('purged');
                });

                it('should give each player 1 amber for every card purged', function () {
                    expect(this.player1.amber).toBe(5);
                    expect(this.player2.amber).toBe(3);
                });
            });

            describe('when a trait is selected', function () {
                beforeEach(function () {
                    this.gamgee.ward();
                    this.player1.selectTrait('thief');
                });

                it('should purge all creatures with that trait', function () {
                    expect(this.gamgee.location).toBe('play area');
                    expect(this.lamindra.location).toBe('purged');
                    expect(this.badPenny.location).toBe('purged');
                    expect(this.knucklesBolton.location).toBe('purged');
                    expect(this.troll.location).not.toBe('purged');
                    expect(this.pipPip.location).not.toBe('purged');
                });

                it('should not give 1A for warded creatures', function () {
                    expect(this.gamgee.warded).toBe(false);
                    expect(this.player1.amber).toBe(4);
                    expect(this.player2.amber).toBe(3);
                });
            });
        });
    });
});
