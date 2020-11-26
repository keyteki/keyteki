describe('Niffle Kong', function () {
    describe("Niffle Kong's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['fuzzy-gruen', 'niffle-ape'],
                    hand: ['niffle-kong', 'niffle-kong2', 'save-the-pack'],
                    discard: [
                        'niffle-ape',
                        'niffle-ape',
                        'niffle-ape',
                        'niffle-queen',
                        'niffle-queen'
                    ]
                },
                player2: {
                    amber: 5,
                    inPlay: ['mothergun', 'zorg', 'collector-worm']
                }
            });

            this.niffleApe1 = this.player1.player.cardsInPlay[1];
            this.niffleApe2 = this.player1.player.discard[0];
            this.niffleApe3 = this.player1.player.discard[1];
            this.niffleApe4 = this.player1.player.discard[2];
            this.niffleQueen1 = this.player1.player.discard[3];
            this.niffleQueen2 = this.player1.player.discard[4];
        });

        it('should not be able to play with just part 1', function () {
            this.player1.moveCard(this.niffleKong2, 'discard');
            this.player1.clickCard(this.niffleKong);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not be able to play with just part 2', function () {
            this.player1.moveCard(this.niffleKong, 'discard');
            this.player1.clickCard(this.niffleKong2);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should be able to play with path 1', function () {
            this.player1.clickCard(this.niffleKong);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 2', function () {
            this.player1.clickCard(this.niffleKong2);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should play starting with part 1', function () {
            this.player1.play(this.niffleKong);
            this.player1.clickPrompt('Done');
            expect(this.niffleKong.location).toBe('play area');
            expect(this.niffleKong.playedParts).toContain(this.niffleKong2);
            expect(this.player1.player.hand).not.toContain(this.niffleKong);
            expect(this.player1.player.hand).not.toContain(this.niffleKong2);
        });

        it('should play starting with part 2', function () {
            this.player1.play(this.niffleKong2);
            this.player1.clickPrompt('Done');
            expect(this.niffleKong2.location).toBe('play area');
            expect(this.niffleKong2.playedParts).toContain(this.niffleKong);
            expect(this.player1.player.hand).not.toContain(this.niffleKong);
            expect(this.player1.player.hand).not.toContain(this.niffleKong2);
        });

        it('should move both cards to discard after destroyed', function () {
            this.player1.play(this.niffleKong);
            this.player1.clickPrompt('Done');
            this.niffleKong.tokens.damage = 1;
            this.player1.play(this.saveThePack);
            expect(this.niffleKong.location).toBe('discard');
            expect(this.niffleKong2.location).toBe('discard');
            expect(this.player1.discard).toContain(this.niffleKong);
            expect(this.player1.discard).toContain(this.niffleKong2);
        });

        it('should reveal and move any number of niffle from discard and deck to hand, including none', function () {
            this.player1.moveCard(this.niffleApe2, 'deck');
            this.player1.moveCard(this.niffleQueen1, 'deck');
            this.player1.play(this.niffleKong);

            expect(this.player1).not.toBeAbleToSelect(this.niffleApe1);
            expect(this.player1).toBeAbleToSelect(this.niffleApe2);
            expect(this.player1).toBeAbleToSelect(this.niffleApe3);
            expect(this.player1).toBeAbleToSelect(this.niffleApe3);
            expect(this.player1).toBeAbleToSelect(this.niffleQueen1);
            expect(this.player1).toBeAbleToSelect(this.niffleQueen2);
            expect(this.player1).toHavePromptButton('Done');

            this.player1.clickPrompt('Done');

            expect(this.niffleApe1.location).toBe('play area');
            expect(this.niffleApe2.location).toBe('deck');
            expect(this.niffleApe3.location).toBe('discard');
            expect(this.niffleApe4.location).toBe('discard');
            expect(this.niffleQueen1.location).toBe('deck');
            expect(this.niffleQueen2.location).toBe('discard');

            expect(this.player1.player.hand.length).toBe(1);
        });

        it('should reveal and move any number of niffle from discard and deck to hand', function () {
            this.player1.moveCard(this.niffleApe2, 'deck');
            this.player1.moveCard(this.niffleQueen1, 'deck');
            this.player1.play(this.niffleKong);

            expect(this.player1).not.toBeAbleToSelect(this.niffleApe1);
            expect(this.player1).toBeAbleToSelect(this.niffleApe2);
            expect(this.player1).toBeAbleToSelect(this.niffleApe3);
            expect(this.player1).toBeAbleToSelect(this.niffleApe4);
            expect(this.player1).toBeAbleToSelect(this.niffleQueen1);
            expect(this.player1).toBeAbleToSelect(this.niffleQueen2);
            expect(this.player1).toHavePromptButton('Done');

            this.player1.clickCard(this.niffleApe2);
            this.player1.clickCard(this.niffleApe3);
            this.player1.clickCard(this.niffleQueen1);
            this.player1.clickCard(this.niffleQueen2);
            this.player1.clickPrompt('Done');

            expect(this.niffleApe1.location).toBe('play area');
            expect(this.niffleApe2.location).toBe('hand');
            expect(this.niffleApe3.location).toBe('hand');
            expect(this.niffleApe4.location).toBe('discard');
            expect(this.niffleQueen1.location).toBe('hand');
            expect(this.niffleQueen1.location).toBe('hand');

            expect(this.player1.player.hand.length).toBe(5);
        });

        it('should be able to reap with the creature and opt not to deal damage', function () {
            this.player1.play(this.niffleKong);
            this.player1.clickPrompt('Done');

            this.niffleKong.exhausted = false;
            this.player1.reap(this.niffleKong);
            this.player1.clickPrompt('Done');
        });

        it('should be able to reap with the creature then deal 3D, destroy an artifact and steal 1A', function () {
            this.player1.play(this.niffleKong);
            this.player1.clickPrompt('Done');

            this.niffleKong.exhausted = false;
            this.player1.reap(this.niffleKong);
            this.player1.clickCard(this.niffleKong);
            expect(this.player1).not.toBeAbleToSelect(this.fuzzyGruen);
            expect(this.player1).toBeAbleToSelect(this.niffleKong);
            expect(this.player1).toBeAbleToSelect(this.niffleApe1);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.collectorWorm);
            this.player1.clickCard(this.niffleApe1);
            expect(this.niffleApe1.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.niffleKong);
            expect(this.player1).toBeAbleToSelect(this.fuzzyGruen);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.collectorWorm);
            this.player1.clickCard(this.collectorWorm);
            this.player1.clickCard(this.mothergun);
            expect(this.collectorWorm.tokens.armor).toBe(2);
            expect(this.mothergun.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
        });

        it('should be able to fight with the creature and opt not to deal damage', function () {
            this.player1.play(this.niffleKong2);
            this.player1.clickPrompt('Done');

            this.niffleKong2.exhausted = false;
            this.player1.fightWith(this.niffleKong2, this.zorg);
            this.player1.clickPrompt('Done');
        });

        it('should be able to fight with the creature then deal 3D, destroy an artifact and steal 1A', function () {
            this.player1.play(this.niffleKong2);
            this.player1.clickPrompt('Done');

            this.niffleKong2.exhausted = false;
            this.player1.fightWith(this.niffleKong2, this.zorg);
            this.player1.clickCard(this.niffleKong2);
            this.player1.clickCard(this.niffleApe1);
            this.player1.clickCard(this.collectorWorm);
            this.player1.clickCard(this.mothergun);
            expect(this.niffleApe1.location).toBe('discard');
            expect(this.collectorWorm.tokens.armor).toBe(2);
            expect(this.mothergun.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('should be able to reap with the creature, hit itself and steal 1A if no enemy creature/artifact are in play', function () {
            this.player2.moveCard(this.zorg, 'discard');
            this.player2.moveCard(this.collectorWorm, 'discard');
            this.player2.moveCard(this.mothergun, 'discard');
            this.player2.moveCard(this.fuzzyGruen, 'discard');
            this.player1.play(this.niffleKong);
            this.player1.clickPrompt('Done');

            this.niffleKong.exhausted = false;
            this.player1.reap(this.niffleKong);
            this.player1.clickCard(this.niffleKong);
            this.player1.clickCard(this.niffleApe1);
            this.player1.clickCard(this.niffleKong);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
        });

        it('should be able to fight with the creature, hit itself and steal 1A if no enemy creature/artifact are in play', function () {
            this.player2.moveCard(this.collectorWorm, 'discard');
            this.player2.moveCard(this.mothergun, 'discard');
            this.player2.moveCard(this.fuzzyGruen, 'discard');
            this.player1.play(this.niffleKong2);
            this.player1.clickPrompt('Done');

            this.niffleKong2.exhausted = false;
            this.player1.fightWith(this.niffleKong2, this.zorg);
            this.player1.clickCard(this.niffleKong2);
            this.player1.clickCard(this.niffleApe1);
            this.player1.clickCard(this.niffleKong2);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('should be archived completely', function () {
            this.collectorWorm.tokens.ward = 1;

            this.player1.play(this.niffleKong);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
            this.player2.clickPrompt('mars');

            this.player2.fightWith(this.collectorWorm, this.niffleKong);
            expect(this.collectorWorm.tokens.ward).toBeUndefined();
            expect(this.niffleKong.location).toBe('archives');
            expect(this.niffleKong2.location).toBe('archives');
            expect(this.player2.archives).toContain(this.niffleKong);
            expect(this.player2.archives).toContain(this.niffleKong2);
        });
    });

    describe("Niffle Kong's Ability should interact with Wild Wormhole", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    inPlay: ['fuzzy-gruen'],
                    hand: ['niffle-kong', 'niffle-kong2', 'wild-wormhole']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'narp', 'zorg']
                }
            });
        });

        it("and prevent playing if part 2 is not in player's hand", function () {
            this.player1.moveCard(this.niffleKong, 'deck');
            this.player1.moveCard(this.niffleKong2, 'discard');
            this.player1.play(this.wildWormhole);
            expect(this.niffleKong.location).toBe('deck');
            expect(this.niffleKong2.location).toBe('discard');
            expect(this.player1).not.toHavePrompt(
                'Which flank do you want to place this creature on?'
            );
        });

        it("and prevent playing if part 1 is not in player's hand", function () {
            this.player1.moveCard(this.niffleKong, 'discard');
            this.player1.moveCard(this.niffleKong2, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.niffleKong.location).toBe('discard');
            expect(this.niffleKong2.location).toBe('deck');
            expect(this.player1).not.toHavePrompt(
                'Which flank do you want to place this creature on?'
            );
        });

        it("and prevent playing even if part 2 is in player's hand", function () {
            this.player1.moveCard(this.niffleKong, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.niffleKong.location).toBe('deck');
            expect(this.niffleKong2.location).toBe('hand');
            expect(this.player1).not.toHavePrompt(
                'Which flank do you want to place this creature on?'
            );
        });

        it("and prevent playing even if part 1 is in player's hand", function () {
            this.player1.moveCard(this.niffleKong2, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.niffleKong.location).toBe('hand');
            expect(this.niffleKong2.location).toBe('deck');
            expect(this.player1).not.toHavePrompt(
                'Which flank do you want to place this creature on?'
            );
        });
    });

    describe("Niffle Kong's Ability should interact with Nature´s Call", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    inPlay: ['fuzzy-gruen'],
                    hand: ['niffle-kong', 'niffle-kong2']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll', 'narp', 'zorg'],
                    hand: ['nature-s-call']
                }
            });
        });

        it('should play part 1 after being returned to hand', function () {
            this.player1.play(this.niffleKong);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.natureSCall);
            this.player2.clickCard(this.fuzzyGruen);
            this.player2.clickCard(this.niffleKong);
            this.player2.clickCard(this.narp);
            this.player2.clickPrompt('Done');

            expect(this.fuzzyGruen.location).toBe('hand');
            expect(this.niffleKong.location).toBe('hand');
            expect(this.niffleKong2.location).toBe('hand');
            expect(this.narp.location).toBe('hand');

            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.play(this.niffleKong2);
        });

        it('should play part 2 after being returned to hand', function () {
            this.player1.play(this.niffleKong2);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.natureSCall);
            this.player2.clickCard(this.fuzzyGruen);
            this.player2.clickCard(this.niffleKong2);
            this.player2.clickCard(this.narp);
            this.player2.clickPrompt('Done');

            expect(this.fuzzyGruen.location).toBe('hand');
            expect(this.niffleKong.location).toBe('hand');
            expect(this.niffleKong2.location).toBe('hand');
            expect(this.narp.location).toBe('hand');

            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.play(this.niffleKong);
        });
    });
});
