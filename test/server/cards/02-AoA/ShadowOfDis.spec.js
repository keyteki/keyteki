describe('Shadow of Dis', function () {
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
                    inPlay: ['tezmal', 'lash-of-broken-dreams'],
                    hand: ['shadow-of-dis', 'dust-imp', 'shooler', 'spyyyder']
                }
            });
        });

        it('should not blank artifacts - autocannon should work', function () {
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

        it('should not blank own cards', function () {
            this.player1.moveCard(this.autocannon, 'discard');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.reap(this.tezmal);
            this.player2.clickPrompt('untamed');
        });

        it("test hideway-hole artifact's elusive does not work", function () {
            this.player1.moveCard(this.autocannon, 'discard');
            this.player1.clickCard(this.hideawayHole);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.fightWith(this.tezmal, this.kindrithLongshot);
            expect(this.tezmal.location).toBe('discard');
            expect(this.kindrithLongshot.tokens.damage).toBe(2); // 2 from tezmal ignoring kindrith's elusive
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

    describe('Shadow of Dis and enter ready / enraged / stunned', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['shadow-of-dis'],
                    inPlay: ['shooler', 'dodger']
                },
                player2: {
                    inPlay: ['hunting-witch'],
                    hand: [
                        'zorg',
                        'gizelhart-s-zealot',
                        'duskwitch',
                        'mighty-tiger',
                        'bumblebird',
                        'ancient-bear'
                    ]
                }
            });

            this.player1.play(this.shadowOfDis);
            this.player1.endTurn();
        });

        it('Zorg should enter play stunned', function () {
            this.player2.clickPrompt('mars');
            this.player2.play(this.zorg);
            expect(this.zorg.stunned).toBe(true);
            this.player2.endTurn();
        });

        it("Gizelhart's Zealot should enter play enraged and ready", function () {
            this.player2.clickPrompt('sanctum');
            this.player2.play(this.gizelhartSZealot);
            expect(this.gizelhartSZealot.enraged).toBe(true);
            expect(this.gizelhartSZealot.exhausted).toBe(false);
            this.player2.fightWith(this.gizelhartSZealot, this.dodger);
            this.player2.endTurn();
        });

        it('test alpha is not blanked', function () {
            this.player2.clickPrompt('untamed');
            this.player2.play(this.ancientBear);
            this.player2.clickCard(this.bumblebird);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            expect(this.player2).toHavePromptButton('Discard this card');
        });

        it('test omega is blanked', function () {
            this.player2.clickPrompt('untamed');
            this.player2.play(this.duskwitch);
            expect(this.duskwitch.exhausted).toBe(false);
            this.player2.play(this.ancientBear);
            expect(this.ancientBear.exhausted).toBe(true);
            this.player2.reap(this.huntingWitch);
            this.player2.endTurn();
        });

        it('test play effects are blanked - mighty tiger will not prompt', function () {
            this.player2.clickPrompt('untamed');
            this.player2.play(this.mightyTiger);
            this.player2.reap(this.huntingWitch);
            this.player2.endTurn();
        });
    });

    describe('Shadow of Dis and interrupts', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'dis',
                    hand: ['shadow-of-dis'],
                    inPlay: ['shooler', 'dodger']
                },
                player2: {
                    inPlay: ['urchin', 'shadow-self'],
                    hand: ['duskrunner']
                }
            });

            this.player1.play(this.shadowOfDis);
            this.player1.endTurn();
        });

        it('shadow self should not redirect damage', function () {
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.urchin, this.dodger);
            expect(this.urchin.location).toBe('discard');
            expect(this.dodger.tokens.damage).toBe(1);
            expect(this.shadowSelf.tokens.damage).toBeUndefined();
            this.player2.endTurn();
        });

        it('should blank gained abilities', function () {
            this.player2.clickPrompt('shadows');
            this.player2.playUpgrade(this.duskrunner, this.shadowSelf);
            this.player2.reap(this.shadowSelf);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
            this.player2.endTurn();
        });
    });
});
