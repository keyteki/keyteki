describe('Blossom Drake', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'shadows',
                inPlay: ['blossom-drake', 'bad-penny', 'seeker-needle']
            },
            player2: {
                inPlay: ['angwish', 'orb-of-invidius']
            }
        });
    });

    it('should not blank creatures', function () {
        this.player1.fightWith(this.badPenny, this.angwish);

        expect(this.badPenny.location).toBe('hand');
    });

    it('should blank artifacts', function () {
        this.player1.reap(this.badPenny);

        expect(this.badPenny.stunned).toBe(false);
    });

    it('should give blossom drake +1 power counters for each artifact', function () {
        expect(this.blossomDrake.power).toBe(6);
    });
});
