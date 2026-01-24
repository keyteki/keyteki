describe('Deusillus', function () {
    describe("Deusillus's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'saurian',
                    inPlay: ['senator-shrix'],
                    hand: ['deusillus', 'deusillus2', 'regrettable-meteor']
                },
                player2: {
                    amber: 5,
                    inPlay: [
                        'troll',
                        'narp',
                        'zorg',
                        'vezyma-thinkdrone',
                        'collector-worm',
                        'ulyq-megamouth'
                    ],
                    hand: ['hypnobeam', 'harvest-time']
                }
            });
        });

        it('should not be able to play with just part 1', function () {
            this.player1.moveCard(this.deusillus2, 'discard');
            this.player1.clickCard(this.deusillus);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not be able to play with just part 2', function () {
            this.player1.moveCard(this.deusillus, 'discard');
            this.player1.clickCard(this.deusillus2);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should be able to play with path 1', function () {
            this.player1.clickCard(this.deusillus);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 2', function () {
            this.player1.clickCard(this.deusillus2);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should play starting with part 1', function () {
            this.player1.play(this.deusillus);
            expect(this.player1).toBeAbleToSelect(this.narp);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            this.player1.clickCard(this.narp);
            expect(this.narp.damage).toBe(4);
            expect(this.deusillus.amber).toBe(5);
            expect(this.deusillus.location).toBe('play area');
            expect(this.deusillus.composedPart).toBe(this.deusillus2);
            expect(this.player1.player.hand).not.toContain(this.deusillus);
            expect(this.player1.player.hand).not.toContain(this.deusillus2);
        });

        it('should play starting with part 2', function () {
            this.player1.play(this.deusillus2);
            expect(this.player1).toBeAbleToSelect(this.narp);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            this.player1.clickCard(this.narp);
            expect(this.narp.damage).toBe(4);
            expect(this.deusillus2.amber).toBe(5);
            expect(this.deusillus2.location).toBe('play area');
            expect(this.deusillus2.composedPart).toBe(this.deusillus);
            expect(this.player1.player.hand).not.toContain(this.deusillus);
            expect(this.player1.player.hand).not.toContain(this.deusillus2);
        });

        it('should move both cards to discard after destroyed', function () {
            this.player1.play(this.deusillus);
            this.player1.clickCard(this.narp);
            this.player1.play(this.regrettableMeteor);
            expect(this.deusillus.location).toBe('discard');
            expect(this.deusillus2.location).toBe('discard');
            expect(this.player1.discard).toContain(this.deusillus);
            expect(this.player1.discard).toContain(this.deusillus2);
        });

        it('should be able to reap with the creature', function () {
            this.player1.play(this.deusillus);
            this.player1.clickCard(this.narp);
            this.deusillus.ready();
            this.player1.reap(this.deusillus);
            expect(this.deusillus.amber).toBe(4);
            expect(this.narp.damage).toBe(6);
            expect(this.troll.damage).toBe(2);
            expect(this.zorg.damage).toBe(2);
        });

        it('should be able to fight with the creature', function () {
            this.player1.play(this.deusillus2);
            this.player1.clickCard(this.narp);
            this.deusillus2.ready();
            this.player1.fightWith(this.deusillus2, this.zorg);
            expect(this.deusillus2.damage).toBe(7);
            expect(this.zorg.location).toBe('discard');
            expect(this.deusillus2.amber).toBe(4);
            expect(this.narp.damage).toBe(6);
            expect(this.troll.damage).toBe(2);
        });

        it('should be archived completely', function () {
            this.collectorWorm.ward();

            this.player1.play(this.deusillus);
            this.player1.clickCard(this.narp);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');

            this.player2.fightWith(this.collectorWorm, this.deusillus);
            expect(this.collectorWorm.warded).toBe(false);
            expect(this.deusillus.location).toBe('archives');
            expect(this.deusillus2.location).toBe('archives');
            expect(this.player2.archives).toContain(this.deusillus);
            expect(this.player2.archives).toContain(this.deusillus2);
        });

        it('should be taken control by hypnobeam', function () {
            this.player1.play(this.deusillus);
            this.player1.clickCard(this.narp);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.deusillus);
            this.player2.clickPrompt('Left');
            expect(this.deusillus.location).toBe('play area');
            expect(this.player2.player.cardsInPlay).toContain(this.deusillus);
            this.player2.reap(this.ulyqMegamouth);
            this.player2.clickCard(this.deusillus);
            this.player2.clickPrompt('Reap with this creature');
        });

        it("should go to owner's archive when not specified by card", function () {
            this.player1.play(this.deusillus);
            this.player1.clickCard(this.narp);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.deusillus);
            this.player2.clickPrompt('Left');
            expect(this.deusillus.location).toBe('play area');
            expect(this.player2.player.cardsInPlay).toContain(this.deusillus);
            this.player2.reap(this.vezymaThinkdrone);
            this.player2.clickCard(this.deusillus);
            expect(this.deusillus.location).toBe('archives');
            expect(this.deusillus2.location).toBe('archives');
            expect(this.player1.archives).toContain(this.deusillus);
            expect(this.player1.archives).toContain(this.deusillus2);
        });

        it('should have traits when part 1 is played', function () {
            this.player1.play(this.deusillus);
            this.player1.clickCard(this.narp);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.harvestTime);
            this.player2.selectTrait('mutant');
            expect(this.deusillus.location).toBe('purged');
            expect(this.deusillus2.location).toBe('purged');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should have traits when part 2 is played', function () {
            this.player1.play(this.deusillus2);
            this.player1.clickCard(this.narp);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.harvestTime);
            this.player2.selectTrait('mutant');
            expect(this.deusillus.location).toBe('purged');
            expect(this.deusillus2.location).toBe('purged');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe("Deusillus's Ability should interact with Wild Wormhole", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    inPlay: ['senator-shrix'],
                    hand: ['deusillus', 'deusillus2', 'wild-wormhole']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'narp', 'zorg']
                }
            });
        });

        it("and prevent playing if part 2 is not in player's hand", function () {
            this.player1.moveCard(this.deusillus, 'deck');
            this.player1.moveCard(this.deusillus2, 'discard');
            this.player1.play(this.wildWormhole);
            expect(this.deusillus.location).toBe('deck');
            expect(this.deusillus2.location).toBe('discard');
            expect(this.player1).not.toHavePrompt(
                'Which flank do you want to place this creature on?'
            );
        });

        it("and prevent playing if part 1 is not in player's hand", function () {
            this.player1.moveCard(this.deusillus, 'discard');
            this.player1.moveCard(this.deusillus2, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.deusillus.location).toBe('discard');
            expect(this.deusillus2.location).toBe('deck');
            expect(this.player1).not.toHavePrompt(
                'Which flank do you want to place this creature on?'
            );
        });

        it("and prevent playing even if part 2 is in player's hand", function () {
            this.player1.moveCard(this.deusillus, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.deusillus.location).toBe('deck');
            expect(this.deusillus2.location).toBe('hand');
            expect(this.player1).not.toHavePrompt(
                'Which flank do you want to place this creature on?'
            );
        });

        it("and prevent playing even if part 1 is in player's hand", function () {
            this.player1.moveCard(this.deusillus2, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.deusillus.location).toBe('hand');
            expect(this.deusillus2.location).toBe('deck');
            expect(this.player1).not.toHavePrompt(
                'Which flank do you want to place this creature on?'
            );
        });
    });

    describe("Deusillus's Ability should interact with Nature´s Call", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'saurian',
                    inPlay: ['senator-shrix'],
                    hand: ['deusillus', 'deusillus2']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'narp', 'zorg'],
                    hand: ['nature-s-call']
                }
            });
        });

        it('should play part 1 after being returned to hand', function () {
            this.player1.play(this.deusillus);
            this.player1.clickCard(this.narp);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.natureSCall);
            this.player2.clickCard(this.senatorShrix);
            this.player2.clickCard(this.deusillus);
            this.player2.clickCard(this.narp);
            this.player2.clickPrompt('Done');

            expect(this.senatorShrix.location).toBe('hand');
            expect(this.deusillus.location).toBe('hand');
            expect(this.deusillus2.location).toBe('hand');
            expect(this.narp.location).toBe('hand');

            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.play(this.deusillus2);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(5);
        });

        it('should play part 2 after being returned to hand', function () {
            this.player1.play(this.deusillus2);
            this.player1.clickCard(this.narp);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.natureSCall);
            this.player2.clickCard(this.senatorShrix);
            this.player2.clickCard(this.deusillus2);
            this.player2.clickCard(this.narp);
            this.player2.clickPrompt('Done');

            expect(this.senatorShrix.location).toBe('hand');
            expect(this.deusillus.location).toBe('hand');
            expect(this.deusillus2.location).toBe('hand');
            expect(this.narp.location).toBe('hand');

            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.play(this.deusillus);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(5);
        });
    });

    describe("Deusillus's Ability should interact with Lost in the Woods", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'saurian',
                    inPlay: ['senator-shrix'],
                    hand: ['deusillus', 'deusillus2']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'narp', 'zorg'],
                    hand: ['lost-in-the-woods']
                }
            });

            this.player1.play(this.deusillus);
            this.player1.clickCard(this.narp);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
        });

        it("should return both parts of deusillus to owner's deck", function () {
            this.player2.play(this.lostInTheWoods);
            this.player2.clickCard(this.narp);
            this.player2.clickCard(this.zorg);
            this.player2.clickPrompt('Done');
            this.player2.clickCard(this.senatorShrix);
            this.player2.clickCard(this.deusillus);
            this.player2.clickPrompt('Done');

            expect(this.senatorShrix.location).toBe('deck');
            expect(this.deusillus.location).toBe('deck');
            expect(this.deusillus2.location).toBe('deck');
            expect(this.narp.location).toBe('deck');
            expect(this.zorg.location).toBe('deck');

            expect(this.player1.player.hand).not.toContain(this.deusillus);
            expect(this.player1.player.hand).not.toContain(this.deusillus2);

            expect(this.player1.player.deck).toContain(this.deusillus);
            expect(this.player1.player.deck).toContain(this.deusillus2);

            expect(this.deusillus.controller).toBe(this.player1.player);
            expect(this.deusillus2.controller).toBe(this.player1.player);
        });
    });

    describe("Deusillus's Ability should interact with Overlord Greking", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'saurian',
                    inPlay: ['senator-shrix'],
                    hand: ['deusillus', 'deusillus2']
                },
                player2: {
                    amber: 5,
                    inPlay: ['overlord-greking', 'narp', 'zorg']
                }
            });
        });

        it('should play part 1 after being returned to hand', function () {
            this.player1.play(this.deusillus);
            this.player1.clickCard(this.narp);
            this.player1.endTurn();
            this.deusillus.tokens.damage = 19;
            this.overlordGreking.ward();
            this.player2.clickPrompt('dis');
            this.player2.fightWith(this.overlordGreking, this.deusillus);
            this.player2.clickPrompt('Left');

            expect(this.deusillus.location).toBe('play area');
            expect(this.deusillus.controller).toBe(this.player2.player);
        });
    });

    describe("Deusillus's Ability should interact with Spangler Box", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'saurian',
                    inPlay: ['senator-shrix'],
                    hand: ['deusillus', 'deusillus2', 'poltergeist']
                },
                player2: {
                    amber: 5,
                    inPlay: ['narp', 'zorg'],
                    hand: ['spangler-box']
                }
            });

            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.spanglerBox);
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
        });

        it('should purge both Deusillus parts', function () {
            this.player1.play(this.deusillus);
            this.player1.clickCard(this.narp);
            this.player1.endTurn();

            this.player2.clickPrompt('logos');
            this.player2.useAction(this.spanglerBox);
            this.player2.clickCard(this.deusillus);

            expect(this.deusillus.location).toBe('purged');
            expect(this.deusillus2.location).toBe('purged');

            expect(this.deusillus.purgedBy).toBe(this.spanglerBox);
            expect(this.deusillus2.purgedBy).toBe(this.spanglerBox);

            expect(this.spanglerBox.purgedCards).toContain(this.deusillus);
            expect(this.spanglerBox.purgedCards).toContain(this.deusillus2);
        });

        it('should put Deusillus in play after Spangler Box is destroyed', function () {
            this.player1.play(this.deusillus);
            this.player1.clickCard(this.narp);
            this.player1.endTurn();

            this.player2.clickPrompt('logos');
            this.player2.useAction(this.spanglerBox);
            this.player2.clickCard(this.deusillus);
            this.player2.endTurn();

            this.player1.clickPrompt('dis');
            this.player1.play(this.poltergeist);
            this.player1.clickCard(this.spanglerBox);

            expect(this.player1).toBeAbleToSelect(this.deusillus);
            expect(this.player1).toBeAbleToSelect(this.deusillus2);

            this.player1.clickCard(this.deusillus);
            expect(this.player1).toHavePrompt('Deusillus');
            this.player1.clickPrompt('Left');

            expect(this.spanglerBox.location).toBe('discard');
            expect(this.zorg.location).toBe('play area');
            expect(this.zorg.controller).toBe(this.player2.player);
            expect(this.deusillus.location).toBe('play area');
            expect(this.deusillus.composedPart).toBe(this.deusillus2);
            expect(this.player1.player.hand).not.toContain(this.deusillus);
            expect(this.player1.player.hand).not.toContain(this.deusillus2);
            expect(this.deusillus.controller).toBe(this.player1.player);

            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Playing a bottom gigantic part with two top parts', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'saurian',
                    hand: ['deusillus', 'deusillus', 'deusillus2', 'deusillus2', 'senator-shrix']
                },
                player2: {
                    amber: 5,
                    inPlay: ['spangler-box', 'narp', 'zorg']
                }
            });

            this.deusillusBottom1 = this.player1.hand[0];
            this.deusillusBottom2 = this.player1.hand[1];
            this.deusillusTop1 = this.player1.hand[2];
            this.deusillusTop2 = this.player1.hand[3];

            this.deusillusTop2.enhancements = ['amber', 'amber'];
        });

        it('should ask for the top part to be played with', function () {
            this.player1.play(this.deusillusBottom1);
            expect(this.player1).toHavePrompt('Choose a top part to play');
            expect(this.player1).toBeAbleToSelect(this.deusillusTop1);
            expect(this.player1).toBeAbleToSelect(this.deusillusTop2);
            expect(this.player1).not.toBeAbleToSelect(this.deusillusBottom1);
            expect(this.player1).not.toBeAbleToSelect(this.deusillusBottom2);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            this.player1.clickCard(this.deusillusTop1);
            this.player1.clickCard(this.narp);
            expect(this.narp.damage).toBe(4);
            expect(this.deusillusBottom1.amber).toBe(5);
            expect(this.player1.amber).toBe(2);
            expect(this.deusillusBottom1.location).toBe('play area');
            expect(this.deusillusBottom1.composedPart).toBe(this.deusillusTop1);
            expect(this.player1.player.hand).not.toContain(this.deusillusTop1);
            expect(this.player1.player.hand).not.toContain(this.deusillusBottom1);
            expect(this.player1.player.hand).toContain(this.deusillusTop2);
            expect(this.player1.player.hand).toContain(this.deusillusBottom2);
            this.player1.endTurn();
        });

        it('should ask for the top part to be played with and select one with enhancements', function () {
            this.player1.play(this.deusillusBottom1);
            expect(this.player1).toHavePrompt('Choose a top part to play');
            expect(this.player1).toBeAbleToSelect(this.deusillusTop1);
            expect(this.player1).toBeAbleToSelect(this.deusillusTop2);
            expect(this.player1).not.toBeAbleToSelect(this.deusillusBottom1);
            expect(this.player1).not.toBeAbleToSelect(this.deusillusBottom2);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            this.player1.clickCard(this.deusillusTop2);
            this.player1.clickCard(this.narp);
            expect(this.narp.damage).toBe(4);
            expect(this.deusillusBottom1.amber).toBe(5);
            expect(this.player1.amber).toBe(4);
            expect(this.deusillusBottom1.location).toBe('play area');
            expect(this.deusillusBottom1.composedPart).toBe(this.deusillusTop2);
            expect(this.player1.player.hand).not.toContain(this.deusillusTop2);
            expect(this.player1.player.hand).not.toContain(this.deusillusBottom1);
            expect(this.player1.player.hand).toContain(this.deusillusTop1);
            expect(this.player1.player.hand).toContain(this.deusillusBottom2);
            this.player1.endTurn();
        });

        it('should not ask for the bottom part to be played with', function () {
            this.player1.play(this.deusillusTop1);
            expect(this.player1).not.toHavePrompt('Choose a top part to play');
            this.player1.clickCard(this.narp);
            expect(this.narp.damage).toBe(4);
            expect(this.deusillusTop1.amber).toBe(5);
            expect(this.deusillusTop1.location).toBe('play area');
            expect(this.deusillusTop1.composedPart).toBe(this.deusillusBottom1);
            expect(this.player1.player.hand).not.toContain(this.deusillusTop1);
            expect(this.player1.player.hand).not.toContain(this.deusillusBottom1);
            expect(this.player1.player.hand).toContain(this.deusillusTop2);
            expect(this.player1.player.hand).toContain(this.deusillusBottom2);
            this.player1.endTurn();
        });
    });

    describe("Deusillus's leaving archive", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'saurian',
                    inPlay: ['senator-shrix', 'charybdis', 'nerotaurus', 'saurian-egg'],
                    hand: ['deusillus', 'deusillus2']
                },
                player2: {
                    amber: 3,
                    inPlay: ['narp', 'zorg'],
                    hand: ['mass-abduction', 'ammonia-clouds']
                }
            });

            this.player1.play(this.deusillus);
            this.player1.clickCard(this.narp);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
        });

        it("should put put both parts in archive and return to owner's hand when archive is taken", function () {
            this.player2.play(this.ammoniaClouds);
            this.player2.play(this.massAbduction);

            expect(this.player2).toBeAbleToSelect(this.deusillus);
            expect(this.player2).toBeAbleToSelect(this.senatorShrix);
            expect(this.player2).toBeAbleToSelect(this.charybdis);
            expect(this.player2).toBeAbleToSelect(this.nerotaurus);
            expect(this.player2).not.toBeAbleToSelect(this.saurianEgg);
            expect(this.player2).toHavePromptButton('Done');

            this.player2.clickCard(this.deusillus);
            this.player2.clickCard(this.charybdis);
            this.player2.clickCard(this.nerotaurus);
            this.player2.clickPrompt('Done');

            expect(this.deusillus.location).toBe('archives');
            expect(this.deusillus2.location).toBe('archives');
            expect(this.charybdis.location).toBe('archives');
            expect(this.nerotaurus.location).toBe('archives');

            expect(this.deusillus.controller).toBe(this.player2.player);
            expect(this.deusillus2.controller).toBe(this.player2.player);
            expect(this.charybdis.controller).toBe(this.player2.player);
            expect(this.nerotaurus.controller).toBe(this.player2.player);

            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.clickPrompt('Yes');

            expect(this.deusillus.location).toBe('hand');
            expect(this.deusillus2.location).toBe('hand');
            expect(this.charybdis.location).toBe('hand');
            expect(this.nerotaurus.location).toBe('hand');

            expect(this.deusillus.controller).toBe(this.player1.player);
            expect(this.deusillus2.controller).toBe(this.player1.player);
            expect(this.charybdis.controller).toBe(this.player1.player);
            expect(this.nerotaurus.controller).toBe(this.player1.player);

            expect(this.player1.player.hand).toContain(this.deusillus);
            expect(this.player1.player.hand).toContain(this.deusillus2);
            expect(this.player1.player.hand).toContain(this.charybdis);
            expect(this.player1.player.hand).toContain(this.nerotaurus);
        });
    });
});
