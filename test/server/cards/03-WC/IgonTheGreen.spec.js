describe('Igon The Green', function () {
    describe("Igon The Green's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['igon-the-terrible', 'igon-the-terrible'],
                    inPlay: ['igon-the-green']
                },
                player2: {
                    inPlay: ['mother', 'troll', 'dextre']
                }
            });

            this.igonTheTerrible1 = this.player1.hand[0];
            this.igonTheTerrible2 = this.player1.hand[1];
        });
        it('should purge Igon the Green and not return any Igon The Terrible', function () {
            this.player1.fightWith(this.igonTheGreen, this.troll);
            expect(this.igonTheGreen.location).toBe('purged');
        });
        it('should purge Igon the Green and not return Igon The Terrible since it is archived', function () {
            this.player1.moveCard(this.igonTheTerrible1, 'archives');
            expect(this.igonTheTerrible1.location).toBe('archives');
            expect(this.igonTheTerrible2.location).toBe('hand');
            this.player1.fightWith(this.igonTheGreen, this.troll);
            expect(this.igonTheGreen.location).toBe('purged');
        });
        it('should purge Igon the Green and return Igon The Terrible to hand', function () {
            this.player1.playCreature(this.igonTheTerrible1);
            expect(this.igonTheTerrible1.location).toBe('discard');
            expect(this.igonTheTerrible2.location).toBe('hand');
            this.player1.fightWith(this.igonTheGreen, this.troll);
            expect(this.igonTheGreen.location).toBe('purged');
            expect(this.igonTheTerrible1.location).toBe('hand');
            expect(this.igonTheTerrible2.location).toBe('hand');
        });
        it('should purge Igon the Green and return an Igon The Terrible to hand', function () {
            this.player1.playCreature(this.igonTheTerrible1);
            this.player1.playCreature(this.igonTheTerrible2);
            expect(this.igonTheTerrible1.location).toBe('discard');
            expect(this.igonTheTerrible2.location).toBe('discard');
            this.player1.fightWith(this.igonTheGreen, this.troll);
            expect(this.igonTheGreen.location).toBe('purged');
            expect(this.igonTheTerrible1.location).toBe('discard');
            expect(this.igonTheTerrible2.location).toBe('hand');
        });
        it('should remove ward from Igon the Green and not return any Igon The Terrible', function () {
            this.player1.playCreature(this.igonTheTerrible1);
            this.player1.playCreature(this.igonTheTerrible2);
            expect(this.igonTheTerrible1.location).toBe('discard');
            expect(this.igonTheTerrible2.location).toBe('discard');
            this.igonTheGreen.ward();
            this.player1.fightWith(this.igonTheGreen, this.troll);
            expect(this.igonTheGreen.location).toBe('play area');
            expect(this.igonTheTerrible1.location).toBe('discard');
            expect(this.igonTheTerrible2.location).toBe('discard');
        });
    });
});
