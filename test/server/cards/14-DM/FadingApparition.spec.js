describe('Fading Apparition', function () {
    describe("Fading Apparition's amber redirect on reap", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: [
                        'fading-apparition',
                        'boiler',
                        'jahneerie',
                        'ælbia-stray',
                        'precocious-fragment'
                    ],
                    hand: ['moon-light-special', 'poltergeistoids'],
                    discard: new Array(10).fill('aurascope')
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.player1.makeMaverick(this.moonLightSpecial, 'geistoid');
        });

        it('prompts to redirect when a friendly creature reaps while Fading Apparition is exhausted', function () {
            this.fadingApparition.exhaust();
            this.boiler.amber = 2;
            this.player1.reap(this.jahneerie);
            expect(this.player1).toBeAbleToSelect(this.boiler);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.boiler);
            expect(this.boiler.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can decline the redirect and keep the amber from the common supply', function () {
            this.fadingApparition.exhaust();
            this.boiler.amber = 2;
            this.player1.reap(this.jahneerie);
            this.player1.clickPrompt('Done');
            expect(this.boiler.amber).toBe(2);
            expect(this.jahneerie.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('triggers when Fading Apparition itself reaps because it is exhausted at reap resolution time', function () {
            this.boiler.amber = 1;
            this.player1.reap(this.fadingApparition);
            this.player1.clickCard(this.boiler);
            expect(this.boiler.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('allows targeting Fading Apparition itself if it has amber', function () {
            this.fadingApparition.exhaust();
            this.fadingApparition.amber = 1;
            this.player1.reap(this.jahneerie);
            expect(this.player1).toBeAbleToSelect(this.fadingApparition);
            this.player1.clickCard(this.fadingApparition);
            expect(this.fadingApparition.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not trigger when Fading Apparition is ready', function () {
            this.boiler.amber = 1;
            this.player1.reap(this.jahneerie);
            expect(this.boiler.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not trigger when no friendly creature has amber', function () {
            this.fadingApparition.exhaust();
            this.player1.reap(this.jahneerie);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('removes amber from a creature while the reap gain still resolves normally', function () {
            this.fadingApparition.exhaust();
            this.boiler.amber = 1;
            this.player1.reap(this.jahneerie);
            this.player1.clickCard(this.boiler);
            const logs = this.getChatLogs(20);
            expect(logs).toContain(
                'player1 uses Fading Apparition to take 1 amber from Boiler instead of the common supply'
            );
            // The standard reap-gain message should not appear because the gain handler was replaced.
            expect(logs.some((log) => log.includes('gains 1A'))).toBe(false);
            expect(this.boiler.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('prompts before the reap event resolves so chosen amber is moved before after-reap reactions fire', function () {
            this.boiler.amber = 1;
            this.player2.amber = 1;
            this.player1.moveCard(this.jahneerie, 'hand');
            this.fadingApparition.exhaust();
            this.player1.reap(this.ælbiaStray);
            expect(this.player1).toBeAbleToSelect(this.boiler);
            expect(this.ælbiaStray.amber).toBe(0);
            expect(this.player1).not.toBeAbleToSelect(this.ælbiaStray);
            this.player1.clickCard(this.boiler);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.boiler.amber).toBe(0);
            expect(this.ælbiaStray.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when an enemy creature reaps while Fading Apparition is exhausted', function () {
            this.fadingApparition.exhaust();
            this.boiler.amber = 2;
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.troll);
            expect(this.boiler.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not trigger from actions that gain amber', function () {
            this.fadingApparition.exhaust();
            this.boiler.amber = 2;
            this.player1.play(this.moonLightSpecial);
            expect(this.boiler.amber).toBe(2);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not trigger from after reap abilities', function () {
            this.fadingApparition.exhaust();
            this.boiler.amber = 2;
            this.player1.reap(this.precociousFragment);
            this.player1.clickCard(this.boiler);
            expect(this.boiler.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Fading Apparition's ability while blanked", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['fortune-reverser']
                },
                player2: {
                    inPlay: ['fading-apparition', 'boiler', 'jahneerie']
                }
            });
        });

        it('does not trigger when blanked by Fortune Reverser', function () {
            this.fadingApparition.exhaust();
            this.boiler.amber = 2;
            this.player1.playUpgrade(this.fortuneReverser, this.fadingApparition);
            this.player1.endTurn();
            this.player2.clickPrompt('Geistoid');
            this.player2.reap(this.jahneerie);
            expect(this.player2).not.toBeAbleToSelect(this.boiler);
            expect(this.player2).isReadyToTakeAction();
            expect(this.boiler.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
        });
    });

    describe("Fading Apparition's ability with reap amber abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['widespread-corruption', 'dodger']
                },
                player2: {
                    inPlay: ['fading-apparition', 'boiler', 'jahneerie']
                }
            });
        });

        it('does trigger Widespread corruption when taking from friendly creatures', function () {
            this.fadingApparition.exhaust();
            this.boiler.amber = 2;
            this.player1.endTurn();
            this.player2.clickPrompt('Geistoid');
            this.player2.reap(this.boiler);
            this.player2.clickCard(this.boiler); // Fading Apparition
            this.player2.clickCard(this.dodger); // Widespread Corruption
            expect(this.player2).isReadyToTakeAction();
            expect(this.boiler.amber).toBe(0);
            expect(this.dodger.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('does trigger Widespread corruption when taking from common supply', function () {
            this.fadingApparition.exhaust();
            this.boiler.amber = 2;
            this.player1.endTurn();
            this.player2.clickPrompt('Geistoid');
            this.player2.reap(this.boiler);
            this.player2.clickPrompt('Done'); // Fading Apparition
            this.player2.clickCard(this.dodger); // Widespread Corruption
            expect(this.player2).isReadyToTakeAction();
            expect(this.boiler.amber).toBe(1);
            expect(this.dodger.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });
    });

    describe("Fading Apparition's ability while amber gain is replaced", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['ether-spider']
                },
                player2: {
                    token: 'prospector',
                    inPlay: ['fading-apparition', 'pen-pal'],
                    hand: ['staff-up']
                }
            });
        });

        it('does not trigger when Staff Up replaces the amber gain', function () {
            this.fadingApparition.exhaust();
            this.penPal.amber = 2;
            this.player1.endTurn();
            this.player2.clickPrompt('Ekwidon');
            this.player2.play(this.staffUp);
            this.player2.reap(this.penPal);
            expect(this.player2).not.toBeAbleToSelect(this.fadingApparition);
            expect(this.player2).not.toBeAbleToSelect(this.penPal);
            this.player2.clickPrompt('Right');
            expect(this.player2).isReadyToTakeAction();
            expect(this.penPal.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
        });

        it('does not trigger when Ether Spider replaces the amber destination', function () {
            this.fadingApparition.exhaust();
            this.penPal.amber = 2;
            this.player1.play(this.etherSpider);
            this.player1.endTurn();
            this.player2.clickPrompt('Ekwidon');
            this.player2.reap(this.penPal);
            expect(this.player2).not.toBeAbleToSelect(this.fadingApparition);
            expect(this.player2).not.toBeAbleToSelect(this.penPal);
            expect(this.player2).isReadyToTakeAction();
            expect(this.penPal.amber).toBe(1);
            expect(this.etherSpider.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });
    });
});
