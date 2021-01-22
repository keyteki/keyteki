describe('Captain Kresage Evil Twin', function () {
    describe("Captain Kresage's Evil Twin ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: [
                        'captain-kresage',
                        'titan-guardian',
                        'archimedes',
                        'batdrone',
                        'xenos-bloodshadow'
                    ],
                    hand: ['captain-kresage-evil-twin', 'helper-bot']
                },
                player2: {
                    inPlay: ['macis-asp', 'wrath']
                }
            });
        });

        it('should not remove keyword while not in play', function () {
            expect(this.captainKresage.hasKeyword('elusive')).toBe(true);
            expect(this.captainKresage.hasKeyword('taunt')).toBe(true);
            expect(this.captainKresage.hasKeyword('poison')).toBe(true);
            expect(this.captainKresage.hasKeyword('skirmish')).toBe(true);
            expect(this.titanGuardian.hasKeyword('taunt')).toBe(true);
            expect(this.xenosBloodshadow.hasKeyword('elusive')).toBe(true);
            expect(this.xenosBloodshadow.hasKeyword('poison')).toBe(true);
            expect(this.xenosBloodshadow.hasKeyword('skirmish')).toBe(true);
            expect(this.archimedes.hasKeyword('elusive')).toBe(true);
            expect(this.batdrone.hasKeyword('skirmish')).toBe(true);
            expect(this.macisAsp.hasKeyword('poison')).toBe(true);
            expect(this.wrath.hasKeyword('taunt')).toBe(true);
            expect(this.wrath.hasKeyword('poison')).toBe(true);
            expect(this.wrath.hasKeyword('skirmish')).toBe(true);
        });

        it('should remove keyword from other creatures while in play', function () {
            this.player1.play(this.captainKresageEvilTwin);
            expect(this.captainKresage.hasKeyword('elusive')).toBe(false);
            expect(this.captainKresage.hasKeyword('taunt')).toBe(false);
            expect(this.captainKresage.hasKeyword('poison')).toBe(false);
            expect(this.captainKresage.hasKeyword('skirmish')).toBe(false);
            expect(this.titanGuardian.hasKeyword('taunt')).toBe(false);
            expect(this.xenosBloodshadow.hasKeyword('elusive')).toBe(false);
            expect(this.xenosBloodshadow.hasKeyword('poison')).toBe(false);
            expect(this.xenosBloodshadow.hasKeyword('skirmish')).toBe(false);
            expect(this.archimedes.hasKeyword('elusive')).toBe(false);
            expect(this.batdrone.hasKeyword('skirmish')).toBe(false);
            expect(this.macisAsp.hasKeyword('poison')).toBe(false);
            expect(this.wrath.hasKeyword('taunt')).toBe(false);
            expect(this.wrath.hasKeyword('poison')).toBe(false);
            expect(this.wrath.hasKeyword('skirmish')).toBe(false);
        });
    });
});
