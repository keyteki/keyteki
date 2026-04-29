describe('Save the Pack', function () {
    describe("Save the Pack's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['save-the-pack'],
                    inPlay: ['umbra', 'dust-pixie']
                },
                player2: {
                    inPlay: ['bumpsy', 'troll']
                }
            });
        });

        it('should destroy all damaged creatures and gain a chain', function () {
            this.umbra.damage = 1;
            this.bumpsy.damage = 2;
            this.player1.play(this.saveThePack);
            expect(this.umbra.location).toBe('discard');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.player1.chains).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should still gain a chain even if no creatures are damaged', function () {
            this.player1.play(this.saveThePack);
            expect(this.umbra.location).toBe('play area');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.troll.location).toBe('play area');

            expect(this.player1.chains).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('damage enhancement can be used to destroy a creature', function () {
            this.saveThePack.enhancements = ['damage'];
            this.player1.play(this.saveThePack);
            this.player1.clickCard(this.troll);
            expect(this.umbra.location).toBe('play area');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.troll.location).toBe('discard');
            expect(this.player1.chains).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
