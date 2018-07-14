describe('Invocation of Ash', function () {
    integration(function () {
        describe('Invocation of Ash\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 10,
                        honor: 10,
                        inPlay: ['miya-mystic', 'border-rider', 'shinjo-scout'],
                        hand: ['invocation-of-ash']
                    }
                });
                this.mystic = this.player1.findCardByName('miya-mystic');
                this.rider = this.player1.findCardByName('border-rider');
                this.scout = this.player1.findCardByName('shinjo-scout');
                this.scout.modifyFate(1);
                this.ash = this.player1.playAttachment('invocation-of-ash', this.mystic);
                this.player2.pass();
            });

            it('should cost the player 1 honor to use', function () {
                this.initHonor = this.player1.honor;
                this.player1.clickCard(this.ash);
                this.player1.clickCard(this.rider);
                expect(this.player1.honor).toBe(this.initHonor - 1);
            });

            it('should be able to attach to a character without fate', function () {
                this.player1.clickCard(this.ash);
                this.player1.clickCard(this.rider);
                expect(this.ash.parent).toBe(this.rider);
            });

            it('should remove a fate from a character with fate', function () {
                this.initFate = this.scout.fate;
                this.player1.clickCard(this.ash);
                this.player1.clickCard(this.scout);
                expect(this.ash.parent).toBe(this.scout);
                expect(this.scout.fate).toBe(this.initFate - 1);
            });
        });
    });
});
