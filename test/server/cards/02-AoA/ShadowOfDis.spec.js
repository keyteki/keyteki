fdescribe('Shadow of Dis', function () {
    describe("Shadow of Dis' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['autocannon', 'hunting-witch', 'hideaway-hole', 'kindrith-longshot'],
                    hand: [
                        'bumpsy',
                        'valdr',
                        'dew-faerie',
                        'halacor',
                        'snufflegator',
                        'inka-the-spider',
                        'tantadlin'
                    ]
                },
                player2: {
                    inPlay: ['tezmal'],
                    hand: ['shadow-of-dis', 'dust-imp', 'shooler', 'spyyyder']
                }
            });
        });
        it('should not blank artifacts', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.play(this.dustImp);
            expect(this.dustImp.tokens.damage).toBe(1);
        });

        it('test blanking hunting witch', function () {
            this.player1.play(this.dewFaerie);
            this.player1.clickCard(this.huntingWitch);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.valdr); // should not gain amber due to Hunting witch
            expect(this.valdr.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
        });

        it('test printed skirmish is ignored', function () {
            this.player1.moveCard(this.autocannon, 'discard');
            this.player1.play(this.snufflegator);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.spyyyder);
            this.player2.play(this.shadowOfDis);
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.snufflegator, this.spyyyder);
            expect(this.spyyyder.location).toBe('discard');
            expect(this.snufflegator.tokens.damage).toBe(2); // 2 from spyyyder ignoring snufflegator's skirmish
        });

        it('test halacor skirmish is ignored', function () {
            this.player1.moveCard(this.autocannon, 'discard');
            this.player1.play(this.halacor);
            this.player1.play(this.tantadlin);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.spyyyder);
            this.player2.play(this.shadowOfDis);
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.tantadlin, this.spyyyder);
            expect(this.spyyyder.location).toBe('discard');
            expect(this.tantadlin.tokens.damage).toBe(2); // 2 from spyyyder ignoring halacor's skirmish
        });

        it('test kindrith-longshot elusive is ignored', function () {
            this.player1.moveCard(this.autocannon, 'discard');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.fightWith(this.tezmal, this.kindrithLongshot);
            expect(this.tezmal.location).toBe('discard');
            expect(this.kindrithLongshot.tokens.damage).toBe(2); // 2 from tezmal ignoring kindrith's elusive
        });

        it("test hideway-hole artifact's elusive still works", function () {
            this.player1.moveCard(this.autocannon, 'discard');
            this.player1.clickCard(this.hideawayHole);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.fightWith(this.tezmal, this.kindrithLongshot);
            expect(this.tezmal.hasToken('damage')).toBe(false);
            expect(this.kindrithLongshot.hasToken('damage')).toBe(false);
        });

        it("should wear off after the opponent's turn", function () {
            this.player1.play(this.dewFaerie);
            this.player1.clickCard(this.huntingWitch);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.valdr);
            expect(this.valdr.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.bumpsy);
            this.player1.clickCard(this.huntingWitch);
            expect(this.player1.amber).toBe(2);
        });
    });

    describe('Shadow of Dis Blossom Drake interaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['the-pale-star', 'autocannon'],
                    hand: ['shadow-of-dis', 'ember-imp']
                },
                player2: {
                    inPlay: ['blossom-drake'],
                    hand: ['snufflegator']
                }
            });
            this.blossomDrake.tokens.damage = 1;
        });

        it("Blossom Drake's ability should be active when in play", function () {
            this.player1.play(this.emberImp);
            expect(this.emberImp.hasToken('damage')).toBe(false);
            expect(this.emberImp.location).toBe('play area');
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            this.player2.play(this.snufflegator);
            expect(this.snufflegator.hasToken('damage')).toBe(false);
            expect(this.snufflegator.location).toBe('play area');
        });

        it("Blossom Drake's ability should not be active when Shadow of Dis is active", function () {
            this.player1.play(this.shadowOfDis);
            this.player1.play(this.emberImp);
            expect(this.emberImp.tokens.damage).toBe(1);
            expect(this.emberImp.location).toBe('play area');
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            this.player2.play(this.snufflegator);
            expect(this.snufflegator.tokens.damage).toBe(1);
            expect(this.snufflegator.location).toBe('play area');
        });

        it("Blossom Drake's ability should be active when Shadow of Dis has expired and it is in play", function () {
            this.player1.play(this.shadowOfDis);
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            this.player1.clickPrompt('dis');
            this.player1.play(this.emberImp);
            expect(this.emberImp.hasToken('damage')).toBe(false);
            expect(this.emberImp.location).toBe('play area');
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            this.player2.play(this.snufflegator);
            expect(this.snufflegator.hasToken('damage')).toBe(false);
            expect(this.snufflegator.location).toBe('play area');
        });

        it("Blossom Drake's ability should not active when Shadow of Dis has expired and it has left play", function () {
            this.player1.play(this.shadowOfDis);
            this.player1.clickCard(this.thePaleStar);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.blossomDrake.location).toBe('discard');
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            this.player1.clickPrompt('dis');
            this.player1.play(this.emberImp);
            expect(this.emberImp.tokens.damage).toBe(1);
            expect(this.emberImp.location).toBe('play area');
            this.player1.endTurn();

            this.player2.clickPrompt('untamed');
            this.player2.play(this.snufflegator);
            expect(this.snufflegator.tokens.damage).toBe(1);
            expect(this.snufflegator.location).toBe('play area');
        });
    });
});
