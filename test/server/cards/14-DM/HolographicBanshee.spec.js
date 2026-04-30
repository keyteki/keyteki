describe('Holographic Banshee', function () {
    describe("Holographic Banshee's persistent effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['holographic-banshee', 'echofly', 'shadys', 'troll', 'krump']
                },
                player2: {
                    inPlay: ['helichopper', 'bumpsy']
                }
            });
            this.krump.enhancements = ['geistoid'];
            this.game.checkGameState(true);
        });

        it('grants versatile to friendly Geistoid creatures', function () {
            expect(this.holographicBanshee.hasKeyword('versatile')).toBe(true);
            expect(this.echofly.hasKeyword('versatile')).toBe(true);
            expect(this.shadys.hasKeyword('versatile')).toBe(true);
            expect(this.krump.hasKeyword('versatile')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not grant versatile to friendly non-Geistoid creatures', function () {
            expect(this.troll.hasKeyword('versatile')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not grant versatile to enemy creatures', function () {
            expect(this.helichopper.hasKeyword('versatile')).toBe(false);
            expect(this.bumpsy.hasKeyword('versatile')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('removes versatile when Holographic Banshee leaves play', function () {
            expect(this.echofly.hasKeyword('versatile')).toBe(true);
            expect(this.shadys.hasKeyword('versatile')).toBe(true);
            expect(this.krump.hasKeyword('versatile')).toBe(true);
            this.player1.moveCard(this.holographicBanshee, 'discard');
            expect(this.echofly.hasKeyword('versatile')).toBe(false);
            expect(this.shadys.hasKeyword('versatile')).toBe(false);
            expect(this.krump.hasKeyword('versatile')).toBe(false);

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
