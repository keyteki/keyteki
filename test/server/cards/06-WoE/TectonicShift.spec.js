describe('Tectonic Shift', function () {
    describe("Tectonic Shift's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['tectonic-shift', 'questor-jarta'],
                    inPlay: ['pelf', 'bumpsy']
                },
                player2: {
                    hand: ['flaxia'],
                    inPlay: ['gub', 'murkens', 'umbra', 'charette']
                }
            });
        });

        it('should destroy left half of each battleline', function () {
            this.player1.play(this.tectonicShift);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.pelf.location).toBe('discard');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.gub.location).toBe('discard');
            expect(this.murkens.location).toBe('discard');
            expect(this.umbra.location).toBe('play area');
            expect(this.charette.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy right half of each battleline', function () {
            this.player1.play(this.tectonicShift);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.pelf.location).toBe('play area');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.gub.location).toBe('play area');
            expect(this.murkens.location).toBe('play area');
            expect(this.umbra.location).toBe('discard');
            expect(this.charette.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy mixes halves of each battleline', function () {
            this.player1.play(this.tectonicShift);
            this.player1.clickPrompt('Right'); // enemy
            this.player1.clickPrompt('Left'); // friendly
            expect(this.pelf.location).toBe('discard');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.gub.location).toBe('play area');
            expect(this.murkens.location).toBe('play area');
            expect(this.umbra.location).toBe('discard');
            expect(this.charette.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy handle odd numbered battlelines', function () {
            this.player1.playCreature(this.questorJarta);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.flaxia);
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');

            this.player1.play(this.tectonicShift);
            this.player1.clickPrompt('Right'); // enemy middle creature goes right
            this.player1.clickPrompt('Left'); // friendly middle creature goes left
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.pelf.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.questorJarta.location).toBe('discard');
            expect(this.gub.location).toBe('play area');
            expect(this.murkens.location).toBe('play area');
            expect(this.umbra.location).toBe('discard');
            expect(this.charette.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should empty opponent battleline', function () {
            this.player1.moveCard(this.gub, 'discard');
            this.player1.moveCard(this.murkens, 'discard');
            this.player1.moveCard(this.umbra, 'discard');
            this.player1.moveCard(this.charette, 'discard');

            this.player1.play(this.tectonicShift);
            this.player1.clickPrompt('Left');
            expect(this.pelf.location).toBe('discard');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should handle empty friendly battleline', function () {
            this.player1.moveCard(this.pelf, 'discard');
            this.player1.moveCard(this.bumpsy, 'discard');
            this.player1.play(this.tectonicShift);
            this.player1.clickPrompt('Left');
            expect(this.gub.location).toBe('discard');
            expect(this.murkens.location).toBe('discard');
            expect(this.umbra.location).toBe('play area');
            expect(this.charette.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
