describe('Mimic Gel', function () {
    describe("Mimic Gel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: [
                        'batdrone',
                        'key-to-dis',
                        'tantadlin',
                        'titan-guardian',
                        'xenos-bloodshadow'
                    ],
                    hand: ['mimic-gel', 'phase-shift', 'dextre']
                },
                player2: {
                    inPlay: [
                        'panpaca-anga',
                        'flaxia',
                        'duskwitch',
                        'bumblebird',
                        'troll',
                        'lamindra'
                    ]
                }
            });
        });

        it('should not allow Mimic Gel to be played if there are no creatures in play', function () {
            this.player1.useAction(this.keyToDis, true);
            expect(this.batdrone.location).toBe('discard');
            expect(this.panpacaAnga.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            this.player1.clickCard(this.mimicGel);
            expect(this.player1).toHavePrompt('Mimic Gel');
            expect(this.player1).toHavePromptButton('Discard this card');
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not stop non mimic gel cards from being played', function () {
            this.player1.useAction(this.keyToDis, true);
            this.player1.clickCard(this.dextre);

            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should prompt the player to pick a creature when played', function () {
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            expect(this.player1).toHavePrompt('Mimic Gel');
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.panpacaAnga);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.titanGuardian);
            expect(this.player1).toBeAbleToSelect(this.xenosBloodshadow);
        });

        it('should come into play as a copy of the chosen creature', function () {
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(true);
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.panpacaAnga);
            this.player1.clickPrompt('Left');
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(false);
            expect(this.mimicGel.hasTrait('beast')).toBe(true);
            expect(this.mimicGel.hasHouse('logos')).toBe(true);
            expect(this.mimicGel.hasHouse('untamed')).toBe(false);
            expect(this.mimicGel.power).toBe(5);
            expect(this.mimicGel.name).toBe('Panpaca, Anga');
            expect(this.batdrone.power).toBe(4);
            expect(this.titanGuardian.power).toBe(7);
        });

        it('should allow copying creatures with alpha keyword', function () {
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(true);
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.bumblebird);
            this.player1.clickPrompt('Left');
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(false);
            expect(this.mimicGel.hasTrait('beast')).toBe(true);
            expect(this.mimicGel.hasTrait('insect')).toBe(true);
            expect(this.mimicGel.hasHouse('logos')).toBe(true);
            expect(this.mimicGel.hasHouse('untamed')).toBe(false);
            expect(this.mimicGel.power).toBe(1);
            expect(this.mimicGel.name).toBe('Bumblebird');
            expect(this.batdrone.power).toBe(2);
            expect(this.tantadlin.power).toBe(11);
        });

        it('should copy omega keyword and end turn', function () {
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(true);
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.duskwitch);
            this.player1.clickPrompt('Left');
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(false);
            expect(this.mimicGel.hasTrait('human')).toBe(true);
            expect(this.mimicGel.hasTrait('witch')).toBe(true);
            expect(this.mimicGel.hasHouse('logos')).toBe(true);
            expect(this.mimicGel.hasHouse('untamed')).toBe(false);
            expect(this.mimicGel.getKeywordValue('omega')).toBe(1);
            expect(this.mimicGel.power).toBe(1);
            expect(this.mimicGel.name).toBe('Duskwitch');
            expect(this.mimicGel.exhausted).toBe(false);
            expect(this.player2).toHavePrompt('Choose which house you want to activate this turn');
        });

        it('should copy elusive and hazardous keyword', function () {
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.xenosBloodshadow);
            this.player1.clickPrompt('Left');
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.power).toBe(4);
            expect(this.mimicGel.armor).toBe(0);
            expect(this.mimicGel.getKeywordValue('elusive')).toBe(1);
            expect(this.mimicGel.getKeywordValue('hazardous')).toBe(6);
            expect(this.mimicGel.name).toBe('Xenos Bloodshadow');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.mimicGel);
            expect(this.troll.tokens.damage).toBe(6);
            expect(this.mimicGel.tokens.damage).toBeUndefined();
        });

        it('should copy taunt keyword', function () {
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.titanGuardian);
            this.player1.clickPrompt('Left');
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(false);
            expect(this.mimicGel.hasTrait('beast')).toBe(true);
            expect(this.mimicGel.hasTrait('cyborg')).toBe(true);
            expect(this.mimicGel.hasHouse('logos')).toBe(true);
            expect(this.mimicGel.getKeywordValue('taunt')).toBe(1);
            expect(this.mimicGel.power).toBe(5);
            expect(this.mimicGel.armor).toBe(1);
            expect(this.mimicGel.name).toBe('Titan Guardian');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.clickCard('flaxia');
            this.player2.clickPrompt('Fight with this creature');
            expect(this.player2).toBeAbleToSelect(this.mimicGel);
            expect(this.player2).toBeAbleToSelect(this.titanGuardian);
            expect(this.player2).not.toBeAbleToSelect(this.batdrone);
            expect(this.player2).not.toBeAbleToSelect(this.tantadlin);
        });

        it('should copy deploy keyword', function () {
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.lamindra);
            this.player1.clickPrompt('Deploy Left');
            this.player1.clickCard(this.tantadlin);
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.hasTrait('shapeshifter')).toBe(false);
            expect(this.mimicGel.hasTrait('thief')).toBe(true);
            expect(this.mimicGel.hasTrait('elf')).toBe(true);
            expect(this.mimicGel.hasHouse('logos')).toBe(true);
            expect(this.mimicGel.hasHouse('shadows')).toBe(false);
            expect(this.mimicGel.getKeywordValue('deploy')).toBe(1);
            expect(this.mimicGel.getKeywordValue('elusive')).toBe(1);
            expect(this.mimicGel.neighbors).toContain(this.tantadlin);
            expect(this.mimicGel.neighbors).toContain(this.batdrone);
            expect(this.batdrone.getKeywordValue('elusive')).toBe(1);
            expect(this.tantadlin.getKeywordValue('elusive')).toBe(1);
            expect(this.mimicGel.power).toBe(1);
            expect(this.mimicGel.armor).toBe(0);
            expect(this.mimicGel.name).toBe('Lamindra');
        });
    });

    describe("Two Mimic Gel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: [
                        'batdrone',
                        'key-to-dis',
                        'tantadlin',
                        'titan-guardian',
                        'xenos-bloodshadow',
                        'tezmal'
                    ],
                    hand: ['mimic-gel', 'mimic-gel']
                },
                player2: {
                    inPlay: ['dust-pixie'],
                    hand: ['mimic-gel']
                }
            });

            this.mimicGel1 = this.player1.player.hand[0];
            this.mimicGel2 = this.player1.player.hand[1];
            this.mimicGel3 = this.player2.player.hand[0];
        });

        it('should allow copying the same creature', function () {
            this.player1.clickCard(this.mimicGel1);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Left');

            this.player1.clickCard(this.mimicGel2);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Left');

            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
        });

        it('should allow copying another owned mimic gel', function () {
            this.player1.clickCard(this.mimicGel1);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Left');

            this.player1.clickCard(this.mimicGel2);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.mimicGel1);
            this.player1.clickPrompt('Left');

            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
        });

        it("should allow copying opponent's mimic gel", function () {
            this.player1.clickCard(this.mimicGel1);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Left');

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');

            this.player2.clickCard(this.mimicGel3);
            this.player2.clickPrompt('Play this creature');
            this.player2.clickCard(this.mimicGel1);
            this.player2.clickPrompt('Left');

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
        });

        it('should cascade the effects', function () {
            this.player1.amber = 3;
            this.player2.amber = 3;

            this.player1.clickCard(this.mimicGel1);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.batdrone);
            this.player1.clickPrompt('Left');

            this.player1.endTurn();
            this.player2.clickPrompt('logos');

            this.player2.clickCard(this.mimicGel3);
            this.player2.clickPrompt('Play this creature');
            this.player2.clickCard(this.mimicGel1);
            this.player2.clickPrompt('Left');

            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.fightWith(this.mimicGel1, this.dustPixie);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.mimicGel3, this.tezmal);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
        });
    });

    describe("Mimic Gel and Gigantic's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['niffle-kong', 'niffle-kong2']
                },
                player2: {
                    inPlay: ['dust-pixie'],
                    hand: ['mimic-gel', 'helper-bot', 'imp-losion']
                }
            });
        });

        it('should allow copying gigantic if played bottom part', function () {
            this.player1.play(this.niffleKong);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');

            this.player2.clickCard(this.mimicGel);
            this.player2.clickPrompt('Play this creature');
            this.player2.clickCard(this.niffleKong);
            this.player2.clickPrompt('Left');

            this.player2.clickPrompt('Done');
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.power).toBe(12);
            expect(this.mimicGel.armor).toBe(2);
            expect(this.mimicGel.hasTrait('mutant')).toBe(true);
            expect(this.mimicGel.hasTrait('niffle')).toBe(true);
        });

        it('should allow copying gigantic if played top part', function () {
            this.player1.play(this.niffleKong2);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.clickCard(this.mimicGel);
            this.player2.clickPrompt('Play this creature');
            this.player2.clickCard(this.niffleKong2);
            this.player2.clickPrompt('Left');
            this.player2.clickPrompt('Done');
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.power).toBe(12);
            expect(this.mimicGel.armor).toBe(2);
            expect(this.mimicGel.hasTrait('mutant')).toBe(true);
            expect(this.mimicGel.hasTrait('niffle')).toBe(true);
        });

        it('should continue to copy effect even after gigantic is destroyed (bottom part first)', function () {
            this.player1.play(this.niffleKong);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.clickCard(this.mimicGel);
            this.player2.clickPrompt('Play this creature');
            this.player2.clickCard(this.niffleKong);
            this.player2.clickPrompt('Left');
            this.player2.clickPrompt('Done');
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.power).toBe(12);
            expect(this.mimicGel.armor).toBe(2);
            expect(this.mimicGel.hasTrait('mutant')).toBe(true);
            expect(this.mimicGel.hasTrait('niffle')).toBe(true);
            this.player2.play(this.helperBot);
            this.player2.play(this.impLosion);
            this.player2.clickCard(this.helperBot);
            this.player2.clickCard(this.niffleKong);
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.power).toBe(12);
            expect(this.mimicGel.armor).toBe(2);
            expect(this.mimicGel.hasTrait('mutant')).toBe(true);
            expect(this.mimicGel.hasTrait('niffle')).toBe(true);

            expect(this.niffleKong.location).toBe('discard');
            expect(this.niffleKong2.location).toBe('discard');
            expect(this.helperBot.location).toBe('discard');
        });

        it('should continue to copy effect even after gigantic is destroyed (top part first)', function () {
            this.player1.play(this.niffleKong2);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.clickCard(this.mimicGel);
            this.player2.clickPrompt('Play this creature');
            this.player2.clickCard(this.niffleKong2);
            this.player2.clickPrompt('Left');
            this.player2.clickPrompt('Done');
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.power).toBe(12);
            expect(this.mimicGel.armor).toBe(2);
            expect(this.mimicGel.hasTrait('mutant')).toBe(true);
            expect(this.mimicGel.hasTrait('niffle')).toBe(true);
            this.player2.play(this.helperBot);
            this.player2.play(this.impLosion);
            this.player2.clickCard(this.helperBot);
            this.player2.clickCard(this.niffleKong2);
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.power).toBe(12);
            expect(this.mimicGel.armor).toBe(2);
            expect(this.mimicGel.hasTrait('mutant')).toBe(true);
            expect(this.mimicGel.hasTrait('niffle')).toBe(true);

            expect(this.niffleKong.location).toBe('discard');
            expect(this.niffleKong2.location).toBe('discard');
            expect(this.helperBot.location).toBe('discard');
        });
    });

    describe('Mimic Gel and gained ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['praefectus-ludo', 'hapsis', 'daughter'],
                    hand: ['mimic-gel']
                },
                player2: {
                    hand: ['lost-in-the-woods', 'perilous-wild', 'champion-tabris']
                }
            });

            this.daughter.tokens.amber = 5;

            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.praefectusLudo);
            this.player1.clickPrompt('Left');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
        });

        it('MG maintain the effect when Praefectus Ludo is returned to deck', function () {
            this.player2.play(this.lostInTheWoods);
            this.player2.clickCard(this.praefectusLudo);
            this.player2.clickCard(this.hapsis);
            this.player2.clickPrompt('Done');
            expect(this.praefectusLudo.location).toBe('deck');
            expect(this.hapsis.location).toBe('deck');
            this.player2.play(this.perilousWild);
            expect(this.mimicGel.location).toBe('play area');
            expect(this.daughter.location).toBe('discard');
            expect(this.player2.amber).toBe(2);
        });

        it('MG should stop effect when Praefectus Ludo and Mimic Gel are returned to deck', function () {
            this.player2.play(this.lostInTheWoods);
            this.player2.clickCard(this.praefectusLudo);
            this.player2.clickCard(this.mimicGel);
            this.player2.clickPrompt('Done');
            expect(this.praefectusLudo.location).toBe('deck');
            expect(this.mimicGel.location).toBe('deck');
            this.player2.play(this.perilousWild);
            expect(this.hapsis.location).toBe('play area');
            expect(this.daughter.location).toBe('discard');
            expect(this.player2.amber).toBe(7);
        });
    });

    describe('Mimic Gel and gained reap ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['hapsis', 'daughter', 'creed-of-nurture'],
                    hand: ['mimic-gel']
                },
                player2: {
                    amber: 3,
                    inPlay: ['umbra', 'sequis']
                }
            });

            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.sequis);
            this.player1.clickPrompt('Left');
            this.mimicGel.exhausted = false;
        });

        it('MG should capture 1A after reap', function () {
            this.player1.reap(this.mimicGel);
            expect(this.mimicGel.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });

        it('MG should lose its gained ability after leaving play', function () {
            this.player1.moveCard(this.mimicGel, 'hand');
            this.player1.useAction(this.creedOfNurture, true);
            this.player1.clickCard(this.mimicGel);
            this.player1.clickCard(this.daughter);
            this.player1.reap(this.daughter);
            expect(this.daughter.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });
    });

    describe('Two Mimic Gels and gained ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['johnny-longfingers', 'xeno-thief', 'lyco-thief'],
                    hand: ['mimic-gel', 'mimic-gel']
                },
                player2: {
                    amber: 5,
                    hand: ['lost-in-the-woods', 'perilous-wild']
                }
            });

            this.mimicGel1 = this.player1.hand[0];
            this.mimicGel2 = this.player1.hand[1];

            this.player1.clickCard(this.mimicGel1);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.johnnyLongfingers);
            this.player1.clickPrompt('Left');

            this.player1.clickCard(this.mimicGel2);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.mimicGel1);
            this.player1.clickPrompt('Left');

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
        });

        it('MG maintain the effect when Long Fingers and MG1 are returned to deck', function () {
            this.player2.play(this.lostInTheWoods);
            this.player2.clickCard(this.mimicGel1);
            this.player2.clickCard(this.johnnyLongfingers);
            this.player2.clickPrompt('Done');
            expect(this.mimicGel1.location).toBe('deck');
            expect(this.johnnyLongfingers.location).toBe('deck');
            this.player2.play(this.perilousWild);
            expect(this.mimicGel2.location).toBe('play area');
            this.player2.clickCard(this.xenoThief);
            expect(this.xenoThief.location).toBe('discard');
            expect(this.lycoThief.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Ardent Hero's effect and Mimic Gel", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 1,
                    hand: ['mimic-gel']
                },
                player2: {
                    amber: 4,
                    inPlay: ['ardent-hero', 'champion-anaphiel', 'shooler', 'borr-nit']
                }
            });

            this.player1.play(this.mimicGel);
            this.player1.clickCard(this.ardentHero);
        });

        it('should not take damage from other cards when defending >5 power creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.fightWith(this.championAnaphiel, this.mimicGel);
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.tokens.damage).toBeUndefined();
            expect(this.championAnaphiel.tokens.damage).toBe(3);
        });

        it('should not take damage from other cards when attacking >5 power creature', function () {
            this.mimicGel.exhausted = false;
            this.player1.fightWith(this.mimicGel, this.championAnaphiel);
            expect(this.mimicGel.location).toBe('play area');
            expect(this.mimicGel.tokens.damage).toBeUndefined();
            expect(this.championAnaphiel.tokens.damage).toBe(3);
        });
    });

    describe("Silvertooth's effect and Mimic Gel", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 1,
                    hand: ['mimic-gel']
                },
                player2: {
                    amber: 4,
                    inPlay: ['silvertooth']
                }
            });

            this.player1.play(this.mimicGel);
            this.player1.clickCard(this.silvertooth);
        });

        it('should enter play ready', function () {
            expect(this.mimicGel.exhausted).toBe(false);
        });
    });

    describe("Ether Spider's effect and Mimic Gel", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 1,
                    inPlay: ['dextre'],
                    hand: ['mimic-gel', 'data-forge']
                },
                player2: {
                    amber: 4,
                    inPlay: ['ether-spider'],
                    hand: ['phloxem-spike']
                }
            });

            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.etherSpider);
            this.player1.clickPrompt('Left');
        });

        it('should redirect amber to correct Ether Spider', function () {
            this.player1.reap(this.dextre);
            this.player1.play(this.dataForge);
            expect(this.mimicGel.amber).toBe(0);
            expect(this.etherSpider.amber).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);

            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.reap(this.etherSpider);
            this.player2.play(this.phloxemSpike);
            expect(this.mimicGel.amber).toBe(2);
            expect(this.etherSpider.amber).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });
    });

    describe("Stilt Kin's effect and Mimic Gel", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 1,
                    inPlay: ['stilt-kin', 'groggins'],
                    hand: ['mimic-gel', 'foozle']
                },
                player2: {
                    amber: 4,
                    inPlay: ['hunting-witch'],
                    hand: ['phloxem-spike']
                }
            });
        });

        it('should ready and fight with Stilt-kin when copying a giant', function () {
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.groggins);
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.huntingWitch);
            expect(this.stiltKin.exhausted).toBe(true);
            expect(this.huntingWitch.location).toBe('discard');
        });

        it('should ready and fight when copying Stilt and a giant is played next to him', function () {
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.stiltKin);
            this.player1.clickPrompt('Left');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.foozle, true);
            this.player1.clickCard(this.huntingWitch);
            expect(this.mimicGel.exhausted).toBe(true);
            expect(this.huntingWitch.location).toBe('discard');
        });
    });

    describe("Scowly Caper's effect and Mimic Gel", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    hand: ['scowly-caper'],
                    inPlay: ['stilt-kin', 'groggins']
                },
                player2: {
                    amber: 2,
                    hand: ['mimic-gel']
                }
            });

            this.player1.play(this.scowlyCaper);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
        });

        it('should enter play under opponent control', function () {
            this.player2.clickCard(this.mimicGel);
            this.player2.clickPrompt('Play this creature');
            this.player2.clickCard(this.scowlyCaper);
            this.player2.clickPrompt('Left');
            expect(this.mimicGel.controller).toBe(this.player1.player);
        });

        it('should be used as belonging to any house', function () {
            this.player2.clickCard(this.mimicGel);
            this.player2.clickPrompt('Play this creature');
            this.player2.clickCard(this.scowlyCaper);
            this.player2.clickPrompt('Left');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.mimicGel.ready();
            this.player1.fightWith(this.mimicGel, this.scowlyCaper);
            expect(this.mimicGel.location).toBe('play area');
            expect(this.scowlyCaper.location).toBe('discard');
            this.mimicGel.ready();
            this.player1.reap(this.mimicGel);
            expect(this.player1.amber).toBe(2);
            this.player1.endTurn();
            this.player1.clickCard(this.stiltKin);
        });
    });
});
