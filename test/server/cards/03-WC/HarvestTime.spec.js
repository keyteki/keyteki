describe('Harvest Time', function () {
    describe('play ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'dis',
                    hand: ['harvest-time'],
                    inPlay: ['gamgee', 'bad-penny', 'troll']
                },
                player2: {
                    amber: 2,
                    inPlay: ['knuckles-bolton', 'pip-pip']
                }
            });
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
                    expect(this.knucklesBolton.location).toBe('purged');
                    expect(this.troll.location).not.toBe('purged');
                    expect(this.pipPip.location).not.toBe('purged');
                });

                it('should give each player 1 amber for every card purged', function () {
                    expect(this.player1.amber).toBe(4);
                    expect(this.player2.amber).toBe(3);
                });
            });
        });
    });
});
