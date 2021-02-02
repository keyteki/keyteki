describe('Captain Kresage', function () {
    describe("Captain Kresage's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['captain-kresage'],
                    hand: [
                        'titan-guardian',
                        'archimedes',
                        'helper-bot',
                        'batdrone',
                        'inka-the-spider',
                        'xenos-bloodshadow',
                        'opportunist'
                    ]
                },
                player2: {
                    inPlay: ['macis-asp', 'wrath', 'sniffer']
                }
            });

            this.player1.play(this.helperBot);
        });

        it('should not copy any keyword if no other creature has it', function () {
            expect(this.captainKresage.hasKeyword('elusive')).toBe(false);
            expect(this.captainKresage.hasKeyword('taunt')).toBe(false);
            expect(this.captainKresage.hasKeyword('poison')).toBe(false);
            expect(this.captainKresage.hasKeyword('skirmish')).toBe(false);
        });

        it('should copy taunt from Titan Guardian', function () {
            this.player1.play(this.titanGuardian);
            expect(this.captainKresage.hasKeyword('elusive')).toBe(false);
            expect(this.captainKresage.hasKeyword('taunt')).toBe(true);
            expect(this.captainKresage.hasKeyword('poison')).toBe(false);
            expect(this.captainKresage.hasKeyword('skirmish')).toBe(false);
        });

        it('should copy elusive from Archimedes', function () {
            this.player1.play(this.archimedes);
            expect(this.captainKresage.hasKeyword('elusive')).toBe(true);
            expect(this.captainKresage.hasKeyword('taunt')).toBe(false);
            expect(this.captainKresage.hasKeyword('poison')).toBe(false);
            expect(this.captainKresage.hasKeyword('skirmish')).toBe(false);
        });

        it('should copy poison from Inka the Spider', function () {
            this.player1.play(this.inkaTheSpider);
            expect(this.captainKresage.hasKeyword('elusive')).toBe(false);
            expect(this.captainKresage.hasKeyword('taunt')).toBe(false);
            expect(this.captainKresage.hasKeyword('poison')).toBe(true);
            expect(this.captainKresage.hasKeyword('skirmish')).toBe(false);
        });

        it('should copy skirmish from Inka the Batdrone', function () {
            this.player1.play(this.batdrone);
            expect(this.captainKresage.hasKeyword('elusive')).toBe(false);
            expect(this.captainKresage.hasKeyword('taunt')).toBe(false);
            expect(this.captainKresage.hasKeyword('poison')).toBe(false);
            expect(this.captainKresage.hasKeyword('skirmish')).toBe(true);
        });

        it('should copy multiple keywords from Xenos Bloodshadow', function () {
            this.player1.play(this.xenosBloodshadow);
            expect(this.captainKresage.hasKeyword('elusive')).toBe(true);
            expect(this.captainKresage.hasKeyword('taunt')).toBe(false);
            expect(this.captainKresage.hasKeyword('poison')).toBe(true);
            expect(this.captainKresage.hasKeyword('skirmish')).toBe(true);
        });

        it('should copy abilities gained from upgrades', function () {
            this.player1.play(this.batdrone);
            this.player1.playUpgrade(this.opportunist, this.batdrone);
            expect(this.captainKresage.hasKeyword('elusive')).toBe(true);
            expect(this.captainKresage.hasKeyword('taunt')).toBe(false);
            expect(this.captainKresage.hasKeyword('poison')).toBe(false);
            expect(this.captainKresage.hasKeyword('skirmish')).toBe(true);
        });

        it('should lose abilities when creatures lose them', function () {
            this.player1.play(this.archimedes);
            expect(this.captainKresage.hasKeyword('elusive')).toBe(true);
            expect(this.archimedes.hasKeyword('elusive')).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.useAction(this.sniffer);
            expect(this.captainKresage.hasKeyword('elusive')).toBe(false);
            expect(this.archimedes.hasKeyword('elusive')).toBe(false);
        });
    });
});
