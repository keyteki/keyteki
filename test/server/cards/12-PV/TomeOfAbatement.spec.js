describe('Tome of Abatement', function () {
    describe("Tome of Abatement's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'redemption',
                    hand: ['tome-of-abatement'],
                    inPlay: ['titan-guardian', 'archimedes', 'batdrone', 'xenos-bloodshadow']
                },
                player2: {
                    hand: ['cloaking-dongle'],
                    inPlay: ['macis-asp', 'wrath']
                }
            });
        });

        it('should remove keywords from creatures', function () {
            expect(this.titanGuardian.hasKeyword('taunt')).toBe(true);
            expect(this.xenosBloodshadow.hasKeyword('elusive')).toBe(true);
            expect(this.xenosBloodshadow.hasKeyword('skirmish')).toBe(true);
            expect(this.archimedes.hasKeyword('elusive')).toBe(true);
            expect(this.batdrone.hasKeyword('skirmish')).toBe(true);
            expect(this.macisAsp.hasKeyword('poison')).toBe(true);
            expect(this.wrath.hasKeyword('taunt')).toBe(true);
            expect(this.wrath.hasKeyword('skirmish')).toBe(true);
            this.player1.play(this.tomeOfAbatement);
            expect(this.titanGuardian.hasKeyword('taunt')).toBe(false);
            expect(this.xenosBloodshadow.hasKeyword('elusive')).toBe(false);
            expect(this.xenosBloodshadow.hasKeyword('skirmish')).toBe(false);
            expect(this.archimedes.hasKeyword('elusive')).toBe(false);
            expect(this.batdrone.hasKeyword('skirmish')).toBe(false);
            expect(this.macisAsp.hasKeyword('poison')).toBe(true);
            expect(this.wrath.hasKeyword('taunt')).toBe(false);
            expect(this.wrath.hasKeyword('skirmish')).toBe(false);
        });

        it('should prevent creatures from gaining keywords', function () {
            this.player1.play(this.tomeOfAbatement);
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.playUpgrade(this.cloakingDongle, this.macisAsp);
            expect(this.macisAsp.hasKeyword('elusive')).toBe(false);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
