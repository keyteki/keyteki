describe('Rampaging Brutodon', function () {
    describe("Rampaging Brutodon's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    token: 'grumpus',
                    hand: ['rampaging-brutodon']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });
        });

        it('should make a token creature on play', function () {
            this.player1.playCreature(this.rampagingBrutodon);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Rampaging Brutodon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    inPlay: ['bestiarii-urso', 'rampaging-brutodon', 'pelf', 'broken-axe-outpost']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });
        });

        it('should require destroying a friendly creature to use', function () {
            this.player1.clickCard(this.rampagingBrutodon);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.brokenAxeOutpost);
            this.player1.clickCard(this.pelf);
            expect(this.player1.amber).toBe(2);
            expect(this.pelf.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should pop wards but not allow use of Brutodon', function () {
            this.pelf.ward();
            this.player1.clickCard(this.rampagingBrutodon);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1).toBeAbleToSelect(this.pelf);
            this.player1.clickCard(this.pelf);
            expect(this.player1.amber).toBe(1);
            expect(this.pelf.location).toBe('play area');
            expect(this.pelf.warded).toBe(false);
            expect(this.rampagingBrutodon.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to destroy itself', function () {
            this.player1.clickCard(this.rampagingBrutodon);
            this.player1.clickPrompt('Reap with this creature');
            this.player1.clickCard(this.rampagingBrutodon);
            expect(this.player1.amber).toBe(1);
            expect(this.rampagingBrutodon.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should require destroying a friendly creature to remove stun', function () {
            this.rampagingBrutodon.stun();
            this.player1.clickCard(this.rampagingBrutodon);
            this.player1.clickPrompt("Remove this creature's stun");
            expect(this.player1).toBeAbleToSelect(this.pelf);
            this.player1.clickCard(this.pelf);
            expect(this.pelf.location).toBe('discard');
            expect(this.rampagingBrutodon.stunned).toBe(false);
            expect(this.rampagingBrutodon.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not require destroying a creature when stun is removed by another card', function () {
            this.rampagingBrutodon.stun();
            this.player1.moveCard(this.bestiariiUrso, 'hand');
            this.player1.playCreature(this.bestiariiUrso);
            this.player1.clickCard(this.rampagingBrutodon);
            // Bestiarii Urso should remove stun without Rampaging Brutodon prompting to destroy a creature
            expect(this.pelf.location).toBe('play area');
            expect(this.rampagingBrutodon.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Rampaging Brutodon with Ironyx Propaganda', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    token: 'grumpus',
                    inPlay: ['rampaging-brutodon', 'pelf', 'ironyx-propaganda']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });
            // Manually attach Ironyx Propaganda to Rampaging Brutodon
            this.rampagingBrutodon.upgrades.push(this.ironyxPropaganda);
            this.ironyxPropaganda.parent = this.rampagingBrutodon;
            this.game.checkGameState(true);
        });

        it('should only require destroying a creature once when reaping with Ironyx Propaganda attached', function () {
            // Reap with Rampaging Brutodon - should only prompt once to destroy a creature
            this.player1.clickCard(this.rampagingBrutodon);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1).toBeAbleToSelect(this.pelf);
            this.player1.clickCard(this.pelf);

            // Pelf should be destroyed, brutodon should have reaped
            expect(this.pelf.location).toBe('discard');
            expect(this.player1.amber).toBe(2);

            // Ironyx Propaganda's After Reap should trigger and make a token
            // without prompting again to destroy a creature
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(2); // Brutodon + token
            expect(this.player1).isReadyToTakeAction();
        });

        it('should only require destroying a creature once when fighting with Ironyx Propaganda attached', function () {
            // Fight with Rampaging Brutodon
            // Can't use fightWith helper because the additional cost prompt appears before target selection
            this.player1.clickCard(this.rampagingBrutodon);
            this.player1.clickPrompt('Fight with this creature');
            expect(this.player1).toBeAbleToSelect(this.pelf);
            this.player1.clickCard(this.pelf);

            // Pelf should be destroyed
            expect(this.pelf.location).toBe('discard');

            // Now select target to attack
            this.player1.clickCard(this.umbra);

            // Ironyx Propaganda's After Fight should trigger and make a token
            // without prompting again to destroy a creature
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(2); // Brutodon + token
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Rampaging Brutodon with Minerva's Wings", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    inPlay: ['rampaging-brutodon', 'pelf', 'minerva-s-wings']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });
            // Manually attach Minerva's Wings to Rampaging Brutodon
            this.rampagingBrutodon.upgrades.push(this.minervaSWings);
            this.minervaSWings.parent = this.rampagingBrutodon;
            this.game.checkGameState(true);
        });

        it("should require destroying a creature when using Action ability from Minerva's Wings", function () {
            // Use the Action ability - should prompt to destroy a creature
            this.player1.clickCard(this.rampagingBrutodon);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toBeAbleToSelect(this.pelf);
            this.player1.clickCard(this.pelf);

            // Pelf should be destroyed
            expect(this.pelf.location).toBe('discard');

            // Action ability should resolve - draw 2 cards
            expect(this.player1.player.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Rampaging Brutodon with Election', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    inPlay: ['rampaging-brutodon', 'pelf', 'election']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });
        });

        it('should only require destroying a creature once when reaping and voting', function () {
            // Reap with Rampaging Brutodon - should prompt to destroy a creature for the reap
            this.player1.clickCard(this.rampagingBrutodon);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1).toBeAbleToSelect(this.pelf);
            this.player1.clickCard(this.pelf);

            // Pelf should be destroyed, brutodon should have reaped
            expect(this.pelf.location).toBe('discard');
            expect(this.player1.amber).toBe(2);

            // Election's voting ability should trigger without prompting again to destroy a creature
            // Player should be prompted to vote Yea or Nay, not to destroy a creature
            expect(this.player1).toHavePrompt('Rampaging Brutodon');
            expect(this.player1).toHavePromptButton('Yea');
            expect(this.player1).toHavePromptButton('Nay');
            this.player1.clickPrompt('Yea');

            expect(this.election.tokens.yea).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
