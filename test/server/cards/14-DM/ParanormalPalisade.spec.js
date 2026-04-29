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
            expect(this.player1).isReadyToTakeAction();
        });

        it('gains +4 armor and taunt while exhausted', function () {
            this.player1.reap(this.paranormalPalisade);
            expect(this.paranormalPalisade.exhausted).toBe(true);
            expect(this.paranormalPalisade.armorTotal).toBe(4);
            expect(this.paranormalPalisade.hasKeyword('taunt')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('has Entrench keyword', function () {
            expect(this.paranormalPalisade.hasKeyword('entrench')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Paranormal Palisade's taunt forces fights against it", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['paranormal-palisade', 'lamindra']
                }
            });
            this.paranormalPalisade.exhausted = true;
        });

        it('cannot fight a non-taunt creature while an exhausted Palisade has taunt', function () {
            this.player1.fightWith(this.troll, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.paranormalPalisade);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.lamindra.location).toBe('play area');
            expect(this.lamindra.damage).toBe(0);
        });

        it('can fight Paranormal Palisade itself', function () {
            this.player1.fightWith(this.troll, this.paranormalPalisade);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
