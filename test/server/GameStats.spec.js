describe('Game Stats', function () {
    describe('when playing, reaping and fighting', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['bumpsy'],
                    inPlay: ['troll', 'krump']
                },
                player2: {
                    amber: 3,
                    inPlay: ['flaxia']
                }
            });

            this.p1Stats = () => this.game.stats.getPlayerStats(this.player1.player);
            this.p2Stats = () => this.game.stats.getPlayerStats(this.player2.player);
        });

        it('should record cards played by type and per card', function () {
            this.player1.play(this.bumpsy);

            expect(this.p1Stats().cardsPlayed).toBe(1);
            expect(this.p1Stats().cardsPlayedByType).toEqual({ creature: 1 });
            expect(this.p1Stats().cards['bumpsy'].played).toBe(1);
            expect(this.p2Stats().cardsPlayed).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should record amber lost by the opponent', function () {
            this.player1.play(this.bumpsy);

            expect(this.player2.amber).toBe(2);
            expect(this.p2Stats().amberLost).toBe(1);
            expect(this.p1Stats().amberLost).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should record reaps and the amber gained from them', function () {
            this.player1.reap(this.troll);

            expect(this.p1Stats().reaps).toBe(1);
            expect(this.p1Stats().amberGained).toBe(1);
            expect(this.p1Stats().amberFromReaping).toBe(1);
            expect(this.p1Stats().cards['troll'].reaps).toBe(1);
            expect(this.p1Stats().cards['krump']).toBeUndefined();
            expect(this.player1).isReadyToTakeAction();
        });

        it('should record fights, damage dealt by both sides and destroyed creatures', function () {
            this.player1.fightWith(this.troll, this.flaxia);

            expect(this.flaxia.location).toBe('discard');
            expect(this.troll.damage).toBe(4);
            expect(this.p1Stats().fights).toBe(1);
            expect(this.p1Stats().cards['troll'].fights).toBe(1);
            expect(this.p1Stats().damageDealt).toBe(8);
            expect(this.p2Stats().damageDealt).toBe(4);
            expect(this.p1Stats().enemyCreaturesDestroyed).toBe(1);
            expect(this.p1Stats().creaturesLost).toBe(0);
            expect(this.p2Stats().creaturesLost).toBe(1);
            expect(this.p2Stats().enemyCreaturesDestroyed).toBe(0);
            expect(this.p2Stats().fights).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should record the houses chosen and cards drawn', function () {
            const untamedChosen = this.p2Stats().housesChosen.untamed || 0;
            const drawn = this.p1Stats().cardsDrawn;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');

            expect(this.p1Stats().cardsDrawn).toBeGreaterThan(drawn);
            expect(this.p2Stats().housesChosen.untamed).toBe(untamedChosen + 1);
            expect(this.p2Stats().housesChosen.shadows).toBeUndefined();
            expect(this.player2).isReadyToTakeAction();
        });

        it('should record keys forged and the amber spent on them', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player1.amber = 7;
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('brobnar');

            expect(this.player1.amber).toBe(1);
            expect(this.p1Stats().keysForged).toBe(1);
            expect(this.p1Stats().amberSpentOnKeys).toBe(6);
            expect(this.p2Stats().keysForged).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should include stats in the saved game state', function () {
            this.player1.play(this.bumpsy);

            const saved = this.game
                .getSaveState()
                .players.find((player) => player.name === this.player1.player.name);

            expect(saved.stats.cardsPlayed).toBe(1);
            expect(saved.stats.turns).toBe(this.player1.player.turn);
            expect(saved.stats.manualModeUsed).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should stop recording once the game has been won', function () {
            this.game.concede(this.player2.player.name);
            this.game.continue();
            this.player1.clickPrompt('Continue Playing');
            this.player2.clickPrompt('Yes');
            this.player1.play(this.bumpsy);
            this.player1.reap(this.troll);

            expect(this.bumpsy.location).toBe('play area');
            expect(this.p1Stats().cardsPlayed).toBe(0);
            expect(this.p1Stats().reaps).toBe(0);
            expect(this.p2Stats().amberLost).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should flag games where manual mode was enabled, even after it is switched off', function () {
            this.player1.executeCommand('/manual');
            this.player2.clickPrompt('Yes');

            expect(this.game.manualMode).toBe(true);

            this.player1.executeCommand('/manual');

            expect(this.game.manualMode).toBe(false);
            expect(this.p1Stats().manualModeUsed).toBe(true);
            expect(this.p2Stats().manualModeUsed).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when capturing and stealing amber', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['urchin', 'dust-pixie']
                },
                player2: {
                    amber: 5,
                    hand: ['charette']
                }
            });

            this.p1Stats = () => this.game.stats.getPlayerStats(this.player1.player);
            this.p2Stats = () => this.game.stats.getPlayerStats(this.player2.player);
        });

        it('should record stolen amber for the stealing player', function () {
            this.player1.play(this.urchin);

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            expect(this.p1Stats().amberStolen).toBe(1);
            expect(this.p1Stats().amberGained).toBe(1);
            expect(this.p2Stats().amberStolen).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should record amber captured for the capturing creature controller', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player1.amber = 4;
            this.player2.play(this.charette);

            expect(this.charette.amber).toBe(3);
            expect(this.player1.amber).toBe(1);
            expect(this.p2Stats().amberCaptured).toBe(3);
            expect(this.p1Stats().amberCaptured).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
