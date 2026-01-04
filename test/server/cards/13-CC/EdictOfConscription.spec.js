describe('Edict of Conscription', function () {
    describe("Edict of Conscription's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: [
                        'edict-of-conscription',
                        'charette',
                        'gub',
                        'troll',
                        'gauntlet-of-command'
                    ]
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should destroy itself and make all friendly creatures belong to house Saurian', function () {
            this.player1.useAction(this.edictOfConscription);
            expect(this.edictOfConscription.location).toBe('discard');
            expect(this.charette.hasHouse('saurian')).toBe(true);
            expect(this.gub.hasHouse('saurian')).toBe(true);
            expect(this.troll.hasHouse('saurian')).toBe(true);
            expect(this.lamindra.hasHouse('saurian')).toBe(false);
            this.player1.reap(this.gub);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should only affect friendly creatures', function () {
            this.player1.useAction(this.edictOfConscription);
            expect(this.lamindra.hasHouse('saurian')).toBe(false);
        });

        it('should not affect artifacts', function () {
            this.player1.useAction(this.edictOfConscription);
            expect(this.gauntletOfCommand.hasHouse('saurian')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should last until end of turn', function () {
            this.player1.useAction(this.edictOfConscription);
            expect(this.charette.hasHouse('saurian')).toBe(true);

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');

            // Effect should be gone after turn ends
            expect(this.charette.hasHouse('saurian')).toBe(false);
        });
    });
});
