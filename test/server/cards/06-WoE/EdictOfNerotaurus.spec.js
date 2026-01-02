describe('Edict of Nerotaurus', function () {
    describe("Edict of Nerotaurus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    token: 'trader',
                    inPlay: [
                        'edict-of-nerotaurus',
                        'bull-wark',
                        'scylla',
                        'brutodon-auxiliary',
                        'cornicen-octavia',
                        'saurian-egg',
                        'antiquities-dealer',
                        'trader:faust-the-great',
                        'shrewd-investor'
                    ]
                },
                player2: {
                    amber: 1,
                    inPlay: ['urchin', 'dodger', 'mack-the-knife']
                }
            });
        });

        xit('should not allow two reaps in a row', function () {
            this.player1.reap(this.scylla);
            this.player1.clickCard(this.brutodonAuxiliary);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
        });

        xit('should not allow two fights in a row', function () {
            this.player1.fightWith(this.cornicenOctavia, this.urchin);
            this.player1.clickCard(this.brutodonAuxiliary);
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
        });

        xit('should not allow two fights in a row if opponent dies in first fight from assault', function () {
            this.player1.fightWith(this.scylla, this.urchin);
            expect(this.urchin.location).toBe('discard');
            this.player1.clickCard(this.brutodonAuxiliary);
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
        });

        xit('should allow another reap after a fight', function () {
            this.player1.reap(this.scylla);
            this.player1.fightWith(this.brutodonAuxiliary, this.urchin);
            this.player1.reap(this.cornicenOctavia);
        });

        xit('should allow another fight after a reap', function () {
            this.player1.fightWith(this.scylla, this.urchin);
            this.player1.reap(this.brutodonAuxiliary);
            this.player1.fightWith(this.cornicenOctavia, this.dodger);
        });

        xit('should allow another reap after an omni', function () {
            this.player1.reap(this.scylla);
            this.player1.useAction(this.saurianEgg, true);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            this.player1.reap(this.cornicenOctavia);
        });

        xit('should allow another reap after an action', function () {
            this.player1.reap(this.scylla);
            this.player1.useAction(this.cornicenOctavia);
            this.player1.reap(this.brutodonAuxiliary);
        });

        xit('should work against the opponent too', function () {
            this.player1.reap(this.scylla);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.urchin);
            this.player2.clickCard(this.mackTheKnife);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            this.player2.useAction(this.mackTheKnife);
            this.player2.clickCard(this.scylla);
            this.player2.reap(this.dodger);
        });

        xit('should allow another reap after an action that destroys the creatures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.reap(this.antiquitiesDealer);
            this.player1.useAction(this.trader);
            expect(this.trader.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
            this.player1.reap(this.shrewdInvestor);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Edict of Nerotaurus's ability when coming in or out of play", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: [
                        'brutodon-auxiliary',
                        'cornicen-octavia',
                        'censor-philo',
                        'dark-centurion'
                    ],
                    hand: ['edict-of-nerotaurus', 'blossom-drake']
                },
                player2: {
                    inPlay: ['urchin', 'dodger', 'mack-the-knife']
                }
            });
            this.blossomDrake.maverick = 'saurian';
            this.blossomDrake.printedHouse = 'saurian';
        });

        xit('should not track reap/fight before coming into play', function () {
            this.player1.reap(this.brutodonAuxiliary);
            this.player1.play(this.edictOfNerotaurus);
            this.player1.clickCard(this.cornicenOctavia);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt('cancel');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        xit('should block reap/fight once after leaving play', function () {
            this.player1.play(this.edictOfNerotaurus);
            this.player1.reap(this.brutodonAuxiliary);
            this.player1.moveCard(this.edictOfNerotaurus, 'hand');
            this.player1.clickCard(this.cornicenOctavia);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.urchin);
            this.player1.reap(this.censorPhilo);
            this.player1.reap(this.darkCenturion);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should block reap/fight once after being blanked', function () {
            this.player1.play(this.edictOfNerotaurus);
            this.player1.reap(this.brutodonAuxiliary);
            this.player1.playCreature(this.blossomDrake);
            this.player1.clickCard(this.cornicenOctavia);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.urchin);
            this.player1.reap(this.censorPhilo);
            this.player1.reap(this.darkCenturion);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        // Edict is played in middle of reap ala bot bookton
    });

    describe("Edict of Nerotaurus's ability outside of the main phase", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: [
                        'jargogle',
                        'jargogle',
                        'ghosthawk',
                        'daughter',
                        'brillix-ponder',
                        'strange-gizmo',
                        'edict-of-nerotaurus'
                    ],
                    amber: 6
                },
                player2: {
                    hand: ['edict-of-nerotaurus', 'grammaticus-thrax'],
                    amber: 0
                }
            });

            this.jargogle1 = this.player1.player.hand[0];
            this.jargogle2 = this.player1.player.hand[1];
        });

        xit('should count creatures that reap during start of turn', function () {
            this.player1.play(this.jargogle1);
            this.player1.clickCard(this.edictOfNerotaurus);
            this.player1.play(this.jargogle2);
            this.player1.clickCard(this.ghosthawk);
            this.player1.play(this.brillixPonder);
            this.player1.play(this.daughter);
            this.player1.play(this.strangeGizmo);
            this.brillixPonder.tokens.ward = 1;
            this.daughter.tokens.ward = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.play(this.grammaticusThrax);
            this.grammaticusThrax.tokens.ward = 1;
            this.player2.endTurn();

            // Strange Gizmo causes Jargogle to play Edict of Nerotaurus after forging a key
            this.player1.clickPrompt('red');
            this.player1.clickCard(this.jargogle1); // Edict of Nerotaurus
            this.player1.clickCard(this.jargogle2); // Ghosthawk deploys right of Brillix Ponder
            this.player1.clickPrompt('deploy right');
            this.player1.clickCard(this.brillixPonder);
            this.player1.clickCard(this.brillixPonder); // Reap with Brillix Ponder
            expect(this.daughter.exhausted).toBe(false); // Edict of Nerotaurus prevents Daughter's reap
            this.player1.clickPrompt('logos');
            expect(this.player1.amber).toBe(3);
            this.player1.clickCard(this.daughter);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature'); // Daughter is still ready and can fight
            this.player1.clickPrompt('cancel');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
