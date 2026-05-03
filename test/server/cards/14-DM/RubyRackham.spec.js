describe('Ruby Rackham', function () {
    describe('Ruby Rackham when no red key is forged', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['ruby-rackham']
                },
                player2: {
                    inPlay: ['murmook', 'krump', 'troll']
                }
            });
        });

        it('deals 1 to each enemy flank creature after fight', function () {
            // Ruby (3p, 1 armor) fights left-flank murmook (3p): murmook dies, ruby survives
            this.player1.fightWith(this.rubyRackham, this.murmook);
            expect(this.rubyRackham.location).toBe('play area');
            expect(this.murmook.location).toBe('discard');
            // After murmook dies, krump (was center) is left flank, troll stays right flank
            expect(this.krump.damage).toBe(1);
            expect(this.troll.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Ruby Rackham when red key is forged', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['ruby-rackham']
                },
                player2: {
                    inPlay: ['murmook', 'krump', 'troll']
                }
            });
            this.player1.player.keys.red = true;
        });

        it('deals 4 to each enemy flank creature after fight', function () {
            this.player1.fightWith(this.rubyRackham, this.murmook);
            expect(this.rubyRackham.location).toBe('play area');
            expect(this.murmook.location).toBe('discard');
            // krump (6p) takes 4, troll (8p) takes 4
            expect(this.krump.damage).toBe(4);
            expect(this.troll.damage).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
