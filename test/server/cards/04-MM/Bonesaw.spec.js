describe('bonesaw', function () {
    describe("Bonesaw's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['dust-imp', 'charette'],
                    hand: ['bonesaw']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should enter play ready if a friendly creature was destroyed', function () {
            this.player1.fightWith(this.dustImp, this.batdrone);
            expect(this.dustImp.location).toBe('discard');
            this.player1.play(this.bonesaw);
            expect(this.bonesaw.exhausted).toBe(false);
        });

        it('should not enter play ready if a friendly creature was not destroyed', function () {
            this.player1.fightWith(this.charette, this.batdrone);
            expect(this.charette.location).toBe('play area');
            this.player1.play(this.bonesaw);
            expect(this.bonesaw.exhausted).toBe(true);
        });
    });
});
