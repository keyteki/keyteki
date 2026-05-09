describe('Soft Landing', function () {
    describe("Soft Landing's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: [
                        'zorg',
                        'mindwarper',
                        'soft-landing',
                        'john-smyth',
                        'skybooster-squadron',
                        'commpod',
                        'custom-virus'
                    ],
                    inPlay: ['tunk']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should ready the next creature played when it has another simultaneous ability', function () {
            this.player1.play(this.softLanding);
            this.player1.play(this.zorg);
            expect(this.zorg.stunned).toBe(true);
            expect(this.zorg.exhausted).toBe(false);
            this.player1.play(this.mindwarper);
            expect(this.mindwarper.exhausted).toBe(true);
        });

        it('should not ready twice if creature is returned to hand', function () {
            this.player1.play(this.softLanding);
            this.player1.play(this.skyboosterSquadron);
            expect(this.skyboosterSquadron.exhausted).toBe(false);
            this.player1.reap(this.skyboosterSquadron);
            expect(this.skyboosterSquadron.location).toBe('hand');
            this.player1.play(this.skyboosterSquadron);
            expect(this.skyboosterSquadron.exhausted).toBe(true);
        });

        it('should apply only if creature is played this turn', function () {
            this.player1.play(this.softLanding);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.play(this.skyboosterSquadron);
            expect(this.skyboosterSquadron.exhausted).toBe(true);
        });

        it('should ready the next creature played even when there is another trigger to resolve', function () {
            this.player1.fightWith(this.tunk, this.batdrone);
            expect(this.tunk.damage).toBe(1);
            this.player1.play(this.softLanding);
            this.player1.play(this.mindwarper);
            expect(this.mindwarper.exhausted).toBe(false);
            expect(this.tunk.damage).toBe(0);
        });

        it('should ready the next artifact played', function () {
            this.player1.play(this.softLanding);
            this.player1.play(this.commpod);
            expect(this.commpod.exhausted).toBe(false);
            this.player1.play(this.customVirus);
            expect(this.customVirus.exhausted).toBe(true);
        });
    });

    describe("Soft Landing's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['lamindra', 'murkens']
                },
                player2: {
                    hand: ['troll', 'soft-landing']
                }
            });
            this.player2.moveCard(this.softLanding, 'deck');
        });

        it('should not ready the creature that played it', function () {
            this.player1.play(this.murkens);
            this.player1.clickPrompt('Top of deck');
            expect(this.softLanding.location).toBe('discard');
            expect(this.murkens.exhausted).toBe(true);
            this.player1.play(this.lamindra);
            expect(this.lamindra.exhausted).toBe(false);
        });
    });

    describe("Two Soft Landing's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['ether-spider', 'skybooster-squadron', 'soft-landing', 'soft-landing']
                },
                player2: {
                    hand: ['troll']
                }
            });

            this.softLanding1 = this.player1.hand[2];
            this.softLanding2 = this.player1.hand[3];
        });

        it('should ready a single creature if played sequentially', function () {
            this.player1.play(this.softLanding1);
            this.player1.play(this.softLanding2);
            this.player1.play(this.skyboosterSquadron);
            this.player1.clickPrompt('Soft Landing');
            expect(this.skyboosterSquadron.exhausted).toBe(false);
            this.player1.play(this.etherSpider);
            expect(this.etherSpider.exhausted).toBe(true);
        });

        it('should ready two creatures if played after the first creature', function () {
            this.player1.play(this.softLanding1);
            this.player1.play(this.skyboosterSquadron);
            expect(this.skyboosterSquadron.exhausted).toBe(false);
            this.player1.play(this.softLanding2);
            this.player1.play(this.etherSpider);
            expect(this.etherSpider.exhausted).toBe(false);
        });
    });
});
