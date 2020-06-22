describe('Ultra Gravitron', function () {
    describe("Ultra Gravitron's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['fuzzy-gruen'],
                    hand: ['ultra-gravitron', 'ultra-gravitron2', 'bouncing-deathquark']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'narp', 'zorg', 'collector-worm']
                }
            });
        });

        it('should not be able to play with just part 1', function () {
            this.player1.moveCard(this.ultraGravitron2, 'discard');
            this.player1.clickCard(this.ultraGravitron);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not be able to play with just part 2', function () {
            this.player1.moveCard(this.ultraGravitron, 'discard');
            this.player1.clickCard(this.ultraGravitron2);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should be able to play with path 1', function () {
            this.player1.clickCard(this.ultraGravitron);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 2', function () {
            this.player1.clickCard(this.ultraGravitron2);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should play starting with part 1', function () {
            this.player1.play(this.ultraGravitron);
            expect(this.ultraGravitron.location).toBe('play area');
            expect(this.ultraGravitron.playedParts).toContain(this.ultraGravitron2);
            expect(this.player1.player.hand).not.toContain(this.ultraGravitron);
            expect(this.player1.player.hand).not.toContain(this.ultraGravitron2);
        });

        it('should play starting with part 2', function () {
            this.player1.play(this.ultraGravitron2);
            expect(this.ultraGravitron2.location).toBe('play area');
            expect(this.ultraGravitron2.playedParts).toContain(this.ultraGravitron);
            expect(this.player1.player.hand).not.toContain(this.ultraGravitron);
            expect(this.player1.player.hand).not.toContain(this.ultraGravitron2);
        });

        it('should move both cards to discard after destroyed', function () {
            this.player1.play(this.ultraGravitron);
            this.player1.play(this.bouncingDeathquark);
            this.player1.clickCard(this.narp);
            this.player1.clickCard(this.ultraGravitron);
            this.player1.clickPrompt('No');
            expect(this.narp.location).toBe('discard');
            expect(this.ultraGravitron.location).toBe('discard');
            expect(this.ultraGravitron2.location).toBe('discard');
            expect(this.player1.discard).toContain(this.ultraGravitron);
            expect(this.player1.discard).toContain(this.ultraGravitron2);
        });

        it('should archive 5 cards after played', function () {
            this.player1.play(this.ultraGravitron);
            expect(this.player1.player.archives.length).toBe(5);
        });

        it('should archive 3 cards after played, if deck has only 3 cards', function () {
            this.player1.player.deck = this.player1.player.deck.slice(0, 3);
            this.player1.play(this.ultraGravitron);
            expect(this.player1.player.archives.length).toBe(3);
        });

        it('should archive no cards after played, if deck is empty', function () {
            this.player1.player.deck = [];
            this.player1.play(this.ultraGravitron);
            expect(this.player1.player.archives.length).toBe(0);
        });

        it('should be able to reap with the creature and not apply bonus icon', function () {
            this.player1.play(this.ultraGravitron);
            this.ultraGravitron.exhausted = false;
            this.player1.reap(this.ultraGravitron);
            this.player1.clickCard(this.player1.player.archives[0]);
            expect(this.player1).toBeAbleToSelect(this.ultraGravitron);
            expect(this.player1).toBeAbleToSelect(this.fuzzyGruen);
            expect(this.player1).toBeAbleToSelect(this.narp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            this.player1.clickCard(this.narp);
            expect(this.player1.player.archives.length).toBe(4);
            expect(this.narp.location).toBe('purged');
            expect(this.player1.amber).toBe(1);
        });

        it('should be able to fight with the creature and not apply bonus icon', function () {
            this.player1.play(this.ultraGravitron2);
            this.ultraGravitron2.exhausted = false;
            this.player1.fightWith(this.ultraGravitron2, this.zorg);
            this.player1.clickCard(this.player1.player.archives[0]);
            expect(this.player1).toBeAbleToSelect(this.ultraGravitron2);
            expect(this.player1).toBeAbleToSelect(this.fuzzyGruen);
            expect(this.player1).toBeAbleToSelect(this.narp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.narp);
            expect(this.player1.player.archives.length).toBe(4);
            expect(this.narp.location).toBe('purged');
            expect(this.ultraGravitron2.tokens.damage).toBe(7);
            expect(this.zorg.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
        });

        it('should be able to reap with the creature and apply bonus icon', function () {
            this.player1.play(this.ultraGravitron);
            this.ultraGravitron.exhausted = false;
            this.player1.reap(this.ultraGravitron);
            this.player1.clickCard(this.player1.player.archives[0]);
            expect(this.player1).toBeAbleToSelect(this.ultraGravitron);
            expect(this.player1).toBeAbleToSelect(this.fuzzyGruen);
            expect(this.player1).toBeAbleToSelect(this.narp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            this.player1.clickCard(this.fuzzyGruen);
            expect(this.player1.player.archives.length).toBe(4);
            expect(this.fuzzyGruen.location).toBe('purged');
            expect(this.player1.amber).toBe(3);
        });

        it('should be able to fight with the creature and apply bonus icon', function () {
            this.player1.play(this.ultraGravitron2);
            this.ultraGravitron2.exhausted = false;
            this.player1.fightWith(this.ultraGravitron2, this.zorg);
            this.player1.clickCard(this.player1.player.archives[0]);
            expect(this.player1).toBeAbleToSelect(this.ultraGravitron2);
            expect(this.player1).toBeAbleToSelect(this.fuzzyGruen);
            expect(this.player1).toBeAbleToSelect(this.narp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.fuzzyGruen);
            expect(this.player1.player.archives.length).toBe(4);
            expect(this.fuzzyGruen.location).toBe('purged');
            expect(this.ultraGravitron2.tokens.damage).toBe(7);
            expect(this.zorg.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
        });

        it('should be able to reap with the creature and discard no card since archive is empty', function () {
            this.player1.play(this.ultraGravitron);
            this.ultraGravitron.exhausted = false;
            this.player1.player.archives = [];
            this.player1.reap(this.ultraGravitron);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(1);
        });

        it('should be able to fight with the creature and discard no card since archive is empty', function () {
            this.player1.play(this.ultraGravitron2);
            this.ultraGravitron2.exhausted = false;
            this.player1.player.archives = [];
            this.player1.fightWith(this.ultraGravitron2, this.zorg);
            expect(this.zorg.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(0);
        });

        it('should be archived completely', function () {
            this.collectorWorm.tokens.ward = 1;

            this.player1.play(this.ultraGravitron);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');

            this.player2.fightWith(this.collectorWorm, this.ultraGravitron);
            expect(this.collectorWorm.tokens.ward).toBeUndefined();
            expect(this.ultraGravitron.location).toBe('archives');
            expect(this.ultraGravitron2.location).toBe('archives');
            expect(this.player2.archives).toContain(this.ultraGravitron);
            expect(this.player2.archives).toContain(this.ultraGravitron2);
        });
    });

    describe("Ultra Gravitron's Ability should interact with Wild Wormhole", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    inPlay: ['fuzzy-gruen'],
                    hand: ['ultra-gravitron', 'ultra-gravitron2', 'wild-wormhole']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'narp', 'zorg']
                }
            });
        });

        it("and prevent playing if part 2 is not in player's hand", function () {
            this.player1.moveCard(this.ultraGravitron, 'deck');
            this.player1.moveCard(this.ultraGravitron2, 'discard');
            this.player1.play(this.wildWormhole);
            expect(this.ultraGravitron.location).toBe('deck');
            expect(this.ultraGravitron2.location).toBe('discard');
            expect(this.player1).not.toHavePrompt(
                'Which flank do you want to place this creature on?'
            );
        });

        it("and prevent playing if part 1 is not in player's hand", function () {
            this.player1.moveCard(this.ultraGravitron, 'discard');
            this.player1.moveCard(this.ultraGravitron2, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.ultraGravitron.location).toBe('discard');
            expect(this.ultraGravitron2.location).toBe('deck');
            expect(this.player1).not.toHavePrompt(
                'Which flank do you want to place this creature on?'
            );
        });

        it("and prevent playing even if part 2 is in player's hand", function () {
            this.player1.moveCard(this.ultraGravitron, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.ultraGravitron.location).toBe('deck');
            expect(this.ultraGravitron2.location).toBe('hand');
            expect(this.player1).not.toHavePrompt(
                'Which flank do you want to place this creature on?'
            );
        });

        it("and prevent playing even if part 1 is in player's hand", function () {
            this.player1.moveCard(this.ultraGravitron2, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.ultraGravitron.location).toBe('hand');
            expect(this.ultraGravitron2.location).toBe('deck');
            expect(this.player1).not.toHavePrompt(
                'Which flank do you want to place this creature on?'
            );
        });
    });

    describe("Ultra Gravitron's Ability should interact with Nature´s Call", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    inPlay: ['fuzzy-gruen'],
                    hand: ['ultra-gravitron', 'ultra-gravitron2']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'narp', 'zorg'],
                    hand: ['nature-s-call']
                }
            });
        });

        it('should play part 1 after being returned to hand', function () {
            this.player1.play(this.ultraGravitron);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.natureSCall);
            this.player2.clickCard(this.fuzzyGruen);
            this.player2.clickCard(this.ultraGravitron);
            this.player2.clickCard(this.narp);
            this.player2.clickPrompt('Done');

            expect(this.fuzzyGruen.location).toBe('hand');
            expect(this.ultraGravitron.location).toBe('hand');
            expect(this.ultraGravitron2.location).toBe('hand');
            expect(this.narp.location).toBe('hand');

            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.clickPrompt('No');
            this.player1.play(this.ultraGravitron2);
        });

        it('should play part 2 after being returned to hand', function () {
            this.player1.play(this.ultraGravitron2);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.natureSCall);
            this.player2.clickCard(this.fuzzyGruen);
            this.player2.clickCard(this.ultraGravitron2);
            this.player2.clickCard(this.narp);
            this.player2.clickPrompt('Done');

            expect(this.fuzzyGruen.location).toBe('hand');
            expect(this.ultraGravitron.location).toBe('hand');
            expect(this.ultraGravitron2.location).toBe('hand');
            expect(this.narp.location).toBe('hand');

            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.clickPrompt('No');
            this.player1.play(this.ultraGravitron);
        });
    });
});
