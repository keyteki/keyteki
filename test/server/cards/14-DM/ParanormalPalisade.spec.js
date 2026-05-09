describe('Paranormal Palisade', function () {
    describe("Paranormal Palisade's persistent effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['paranormal-palisade', 'troll']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('does not gain bonuses while ready', function () {
            expect(this.paranormalPalisade.exhausted).toBe(false);
            expect(this.paranormalPalisade.armorTotal).toBe(0);
            expect(this.paranormalPalisade.hasKeyword('taunt')).toBe(false);
            expect(this.paranormalPalisade.hasKeyword('entrench')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gains +4 armor and taunt while exhausted', function () {
            this.player1.reap(this.paranormalPalisade);
            expect(this.paranormalPalisade.exhausted).toBe(true);
            expect(this.paranormalPalisade.armorTotal).toBe(4);
            expect(this.paranormalPalisade.hasKeyword('taunt')).toBe(true);
            expect(this.paranormalPalisade.hasKeyword('entrench')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
