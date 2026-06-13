describe('Lord Invidius', function () {
    describe('while is it not in the centre of the battle line', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['lord-invidius', 'troll', 'shooler']
                },
                player2: {
                    inPlay: [
                        'urchin',
                        'seeker-needle',
                        'mighty-javelin',
                        'library-of-babble',
                        'the-sting'
                    ]
                }
            });
        });

        it('should not gain a reap ability', function () {
            this.player1.reap(this.lordInvidius);

            expect(this.player1).not.toHavePromptButton('Choose a creature');
        });
    });

    describe('while it is in the centre of the battle line', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['troll', 'lord-invidius', 'shooler']
                },
                player2: {
                    inPlay: ['urchin', 'bad-penny', 'knoxx']
                }
            });
        });

        describe('and then reaping with it', function () {
            beforeEach(function () {
                this.player1.reap(this.lordInvidius);
            });

            it('should gain a reap ability', function () {
                expect(this.player1).toHavePrompt('Choose a creature');
            });

            it('should be able to select enemy flank creature', function () {
                expect(this.player1).toBeAbleToSelect(this.urchin);
                expect(this.player1).toBeAbleToSelect(this.knoxx);
                expect(this.player1).not.toBeAbleToSelect(this.badPenny);
                expect(this.player1).not.toBeAbleToSelect(this.shooler);
            });

            describe('and then selecting a flank creature', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.urchin);
                    this.player1.clickPrompt('Left');
                });

                it('should take control of the creature', function () {
                    expect(this.urchin.controller).toBe(this.player1.player);
                });

                it('should change the house of the controller creature to dis', function () {
                    expect(this.urchin.getHouses().includes('dis')).toBe(true);
                });

                it('should exhaust the creature', function () {
                    expect(this.urchin.exhausted).toBe(true);
                });
            });
        });

        describe('and reaping with another creature', function () {
            beforeEach(function () {
                this.player1.reap(this.shooler);
            });

            it('should not grant the reap ability', function () {
                expect(this.player1).not.toHavePrompt('Choose a creature');
            });
        });
    });

    describe('when control of the captured creature later returns to the original player', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['troll', 'lord-invidius', 'waspscream']
                },
                player2: {
                    inPlay: ['urchin', 'waspscream']
                }
            });
            this.player1Wasp = this.player1.findCardByName('waspscream', 'play area');
            this.player2Wasp = this.player2.findCardByName('waspscream', 'play area');
        });

        it('should re-apply house Dis when control of the creature returns', function () {
            this.player1.reap(this.lordInvidius);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.urchin.getHouses()).toEqual(['dis']);

            // Player2's Waspscream takes Urchin back at the start of player2's turn.
            this.player2Wasp.exhaust();
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('Choose a creature');
            this.player2.clickCard(this.urchin);
            this.player2.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.urchin.getHouses()).toEqual(['shadows']);
            this.player2.clickPrompt('shadows');

            // Player1's Waspscream takes Urchin back at the start of player1's turn.
            this.player1Wasp.exhaust();
            this.player2.endTurn();
            this.player2.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player1.player);

            // The Lord Invidius house-change effect should still apply.
            expect(this.urchin.getHouses()).toEqual(['dis']);
            this.player1.clickPrompt('dis');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when it leaves and re-enters the centre of the battle line', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['chan-s-blaster'],
                    inPlay: ['urchin', 'umbra']
                },
                player2: {
                    house: 'dis',
                    inPlay: ['lord-invidius']
                }
            });
        });

        it('should regain its gained reap ability after returning to the centre', function () {
            this.player1.playUpgrade(this.chanSBlaster, this.lordInvidius);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');

            // Take Urchin
            expect(this.lordInvidius.isInCenter()).toBe(true);
            this.player2.reap(this.lordInvidius);
            this.player2.clickPrompt(this.lordInvidius.name);
            expect(this.player2).toHavePrompt('Choose a creature');
            this.player2.clickCard(this.urchin);
            this.player2.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.lordInvidius.isInCenter()).toBe(false);

            // Kill Urchin
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.lordInvidius);
            this.player2.clickPrompt('Deal 2 damage');
            this.player2.clickCard(this.urchin);

            // Take Umbra
            expect(this.player2).toHavePrompt('Choose a creature');
            this.player2.clickCard(this.umbra);
            this.player2.clickPrompt('Left');
            expect(this.umbra.controller).toBe(this.player2.player);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
