describe('Rocketeer Tryska', function () {
    describe("Rocketeer Tryska's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    inPlay: ['rocketeer-tryska'],
                    hand: ['armsmaster-molina', 'dextre', 'wild-wormhole']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });

            this.player1.moveCard(this.armsmasterMolina, 'deck');
        });

        describe('when the tide is not high', function () {
            it('a neighbor should not enter play ready', function () {
                this.player1.play(this.dextre);
                expect(this.dextre.location).toBe('play area');
                expect(this.dextre.exhausted).toBe(true);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('a neighbor should enter play ready', function () {
                this.player1.play(this.dextre);
                expect(this.dextre.location).toBe('play area');
                expect(this.dextre.exhausted).toBe(false);
            });

            it('a neighbor should enter play ready when played from deck', function () {
                this.player1.play(this.wildWormhole);
                this.player1.clickPrompt('Right');
                expect(this.armsmasterMolina.location).toBe('play area');
                expect(this.armsmasterMolina.exhausted).toBe(false);
            });
        });
    });

    describe("Rocketeer Tryska's and tokens", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'ekwidon',
                    token: 'b0-t',
                    inPlay: ['rocketeer-tryska'],
                    hand: ['the-visible-hand']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when the tide is not high', function () {
            it('a token should not enter play ready', function () {
                this.player1.play(this.theVisibleHand);
                this.player1.clickPrompt('Left');
                this.player1.clickPrompt('Right');
                expect(this.player1.inPlay[0].name).toBe('B0-T');
                expect(this.player1.inPlay[0].exhausted).toBe(true);
                expect(this.player1.inPlay[2].name).toBe('B0-T');
                expect(this.player1.inPlay[2].exhausted).toBe(true);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('a token should enter play ready', function () {
                this.player1.play(this.theVisibleHand);
                this.player1.clickPrompt('Left');
                this.player1.clickPrompt('Right');
                expect(this.player1.inPlay[0].name).toBe('B0-T');
                expect(this.player1.inPlay[0].exhausted).toBe(false);
                expect(this.player1.inPlay[2].name).toBe('B0-T');
                expect(this.player1.inPlay[2].exhausted).toBe(false);
            });
        });
    });

    describe("Rocketeer Tryska's and take control", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'ekwidon',
                    token: 'b0-t',
                    hand: ['the-visible-hand', 'talent-scout']
                },
                player2: {
                    amber: 2,
                    hand: ['rocketeer-tryska']
                }
            });

            this.player1.play(this.talentScout);
            this.player1.clickCard(this.rocketeerTryska);
            this.player1.clickPrompt('Left');
            expect(this.rocketeerTryska.controller).toBe(this.player1.player);
        });

        describe('when the tide is not high', function () {
            it('a token should not enter play ready', function () {
                this.player1.play(this.theVisibleHand);
                this.player1.clickPrompt('Left');
                this.player1.clickPrompt('Right');
                expect(this.player1.inPlay[0].name).toBe('B0-T');
                expect(this.player1.inPlay[0].exhausted).toBe(true);
                expect(this.player1.inPlay[2].name).toBe('B0-T');
                expect(this.player1.inPlay[2].exhausted).toBe(true);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('a token should enter play ready', function () {
                this.player1.play(this.theVisibleHand);
                this.player1.clickPrompt('Left');
                this.player1.clickPrompt('Right');
                expect(this.player1.inPlay[0].name).toBe('B0-T');
                expect(this.player1.inPlay[0].exhausted).toBe(false);
                expect(this.player1.inPlay[2].name).toBe('B0-T');
                expect(this.player1.inPlay[2].exhausted).toBe(false);
            });
        });
    });
});
