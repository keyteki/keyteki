describe('Smite', function () {
    describe("Smite's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['smite'],
                    inPlay: ['sequis', 'helper-bot']
                },
                player2: {
                    inPlay: ['murmook', 'mighty-tiger', 'troll']
                }
            });
        });

        it('should cause a creature to fight, and then deal 2 damage to its neighbors', function () {
            this.player1.play(this.smite);
            expect(this.player1).toHavePrompt('Smite');
            this.player1.clickCard(this.sequis);
            expect(this.player1).toHavePrompt('Sequis');
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            this.player1.clickCard(this.mightyTiger);
            expect(this.mightyTiger.location).toBe('discard');
            expect(this.murmook.damage).toBe(2);
            expect(this.troll.damage).toBe(2);
        });

        it("should remove creature's stun", function () {
            this.sequis.stun();
            this.player1.play(this.smite);
            expect(this.player1).toHavePrompt('Smite');
            this.player1.clickCard(this.sequis);
            expect(this.sequis.stunned).toBe(false);
            expect(this.player1).not.toHavePrompt('Sequis');
        });

        it("should remove creature's stun and not damage it", function () {
            this.helperBot.stun();
            this.player1.play(this.smite);
            expect(this.player1).toHavePrompt('Smite');
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.stunned).toBe(false);
            expect(this.player1).not.toHavePrompt('Helper Bot');
            expect(this.helperBot.location).toBe('play area');
            expect(this.helperBot.damage).toBe(0);
        });
    });

    describe("Smite's ability with duma", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['smite'],
                    inPlay: ['sequis', 'helper-bot']
                },
                player2: {
                    inPlay: ['murmook', 'duma-the-martyr', 'troll']
                }
            });
            this.troll.tokens['damage'] = 7;
            this.murmook.tokens['damage'] = 2;
        });

        it('should cause a creature to fight, Duma will heal neighbors, and then deal 2 damage to its neighbors', function () {
            this.player1.play(this.smite);
            this.player1.clickCard(this.sequis);
            expect(this.player1).toHavePrompt('Sequis');
            expect(this.player1).toBeAbleToSelect(this.dumaTheMartyr);
            this.player1.clickCard(this.dumaTheMartyr);
            expect(this.dumaTheMartyr.location).toBe('discard');
            expect(this.murmook.damage).toBe(2);
            expect(this.troll.damage).toBe(2);
        });
    });

    describe("Smite's ability with Shadow Self", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['smite'],
                    inPlay: ['skullion', 'shooler']
                },
                player2: {
                    inPlay: ['urchin', 'shadow-self', 'dodger']
                }
            });
        });

        it('should destroy shadow-self when fighting it with a 7-power creature and there is one neighbor', function () {
            this.player2.moveCard(this.urchin, 'discard');
            this.player1.play(this.smite);
            this.player1.clickCard(this.skullion);
            this.player1.clickCard(this.shadowSelf);
            expect(this.shadowSelf.location).toBe('discard');
            expect(this.dodger.location).toBe('play area');
            expect(this.skullion.location).toBe('play area');
            expect(this.dodger.damage).toBe(0);
            expect(this.skullion.damage).toBe(0);
            this.player1.endTurn();
        });

        it('should destroy shadow-self when fighting it with a 5-power creature and there are two neighbors', function () {
            this.player1.play(this.smite);
            this.player1.clickCard(this.shooler);
            this.player1.clickCard(this.shadowSelf);
            this.player1.clickCard(this.shadowSelf); // shadow self redirect prompt
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.urchin);
            expect(this.shadowSelf.location).toBe('discard');
            expect(this.urchin.location).toBe('play area');
            expect(this.dodger.location).toBe('play area');
            expect(this.shooler.location).toBe('play area');
            expect(this.urchin.damage).toBe(0);
            expect(this.dodger.damage).toBe(0);
            expect(this.shooler.damage).toBe(0);
            this.player1.endTurn();
        });
    });

    describe('Smite with before fight abilities', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['smite'],
                    inPlay: ['lord-golgotha']
                },
                player2: {
                    inPlay: ['prescriptive-grammarbot', 'daughter', 'infomorph']
                }
            });
        });

        it('should target neighbors of attacked creature', function () {
            this.player1.play(this.smite);
            this.player1.clickCard(this.lordGolgotha);

            // Fight Infomorph
            this.player1.clickCard(this.infomorph);

            // Golgotha's before fight ability kills Daughter
            expect(this.daughter.location).toBe('discard');

            // Fight destroys Infomorph
            expect(this.infomorph.location).toBe('discard');

            // Smite deals 2 damage to creatures who were Infomorph's neighbors
            // immediately before it left play
            expect(this.prescriptiveGrammarbot.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Smite with after fight abilities', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['smite', 'bigger-guns-for-everyone'],
                    inPlay: ['impzilla']
                },
                player2: {
                    inPlay: ['flaxia', 'murmook', 'troll', 'mighty-tiger']
                }
            });
            this.player1.makeMaverick(this.biggerGunsForEveryone, 'sanctum');
        });

        it('should target neighbors of attacked creature', function () {
            this.player1.playUpgrade(this.biggerGunsForEveryone, this.impzilla);
            this.player1.play(this.smite);
            this.player1.clickCard(this.impzilla);

            // Fight Troll
            this.player1.clickCard(this.troll);

            // Bigger Guns deals 5 damage to murmook
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Bigger Guns for Everyone');
            expect(this.player1).toHavePromptButton('Impzilla');
            this.player1.clickPrompt(this.biggerGunsForEveryone.name);
            this.player1.clickCard(this.murmook);
            expect(this.murmook.location).toBe('discard');

            // Impzilla's ability destroys Troll
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');

            // Smite deals 2 damage to Troll's neighbors immediately before it left play
            expect(this.flaxia.damage).toBe(2);
            expect(this.mightyTiger.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
