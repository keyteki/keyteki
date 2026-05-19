describe('Doppelganger', function () {
    describe("Doppelganger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['touchstone'],
                    inPlay: ['umbra', 'doppelganger', 'hunting-witch']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll']
                }
            });

            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
        });

        it("should gain the chosen neighbor's traits for the turn", function () {
            expect(this.doppelganger.getTraits()).toEqual(['specter', 'shapeshifter']);

            this.player1.clickCard(this.umbra);
            expect(this.doppelganger.getTraits()).toEqual([
                'specter',
                'shapeshifter',
                'elf',
                'thief'
            ]);

            this.player1.clickPrompt('geistoid');
            this.player1.endTurn();
            expect(this.doppelganger.getTraits()).toEqual(['specter', 'shapeshifter']);

            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.doppelganger.getTraits()).toEqual(['specter', 'shapeshifter']);

            this.player1.clickCard(this.umbra);
            this.player1.clickPrompt('geistoid');
            expect(this.player1).isReadyToTakeAction();
        });

        it("should gain the chosen neighbor's keywords for the turn", function () {
            expect(this.doppelganger.hasKeyword('skirmish')).toBe(false);

            this.player1.clickCard(this.umbra);
            expect(this.doppelganger.hasKeyword('skirmish')).toBe(true);

            this.player1.clickPrompt('geistoid');
            this.player1.endTurn();
            expect(this.doppelganger.hasKeyword('skirmish')).toBe(false);

            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.doppelganger.hasKeyword('skirmish')).toBe(false);

            this.player1.clickCard(this.umbra);
            this.player1.clickPrompt('geistoid');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain a fight ability at the beginning of the turn', function () {
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.umbra);
            this.player1.clickPrompt('geistoid');
            this.player1.fightWith(this.doppelganger, this.troll);
            expect(this.troll.damage).toBe(3);
            expect(this.doppelganger.location).toBe('play area');
            expect(this.doppelganger.damage).toBe(0);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            // Make sure the ability is gone.
            this.player1.clickCard(this.huntingWitch);
            this.player1.clickPrompt('geistoid');
            this.player1.fightWith(this.doppelganger, this.troll);
            expect(this.doppelganger.location).toBe('discard');
            expect(this.troll.damage).toBe(6);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain a static ability at the beginning of the turn', function () {
            this.player1.clickCard(this.huntingWitch);
            this.player1.clickPrompt('geistoid');
            this.player1.playCreature(this.touchstone);
            this.player1.clickCard(this.doppelganger);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not be optional', function () {
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.umbra);
            this.player1.clickPrompt('geistoid');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Doppelganger adjacent to a token creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    token: 'prowler',
                    inPlay: ['prowler:bulleteye', 'doppelganger']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll']
                }
            });

            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
        });

        it("should gain the token creature's abilities, not the face-up side's abilities", function () {
            this.player1.clickCard(this.prowler);
            this.player1.clickPrompt('geistoid');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);

            this.player1.reap(this.doppelganger);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Doppelganger adjacent to another Doppelganger', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['umbra', 'doppelganger', 'doppelganger', 'hunting-witch']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            const doppelgangers = this.player1.filterCardsByName('doppelganger', 'play area');
            this.doppelgangerA = doppelgangers[0];
            this.doppelgangerB = doppelgangers[1];

            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
        });

        it('should not offer the infinite-loop escape on the first resolution against a Doppelganger neighbor', function () {
            this.player1.clickCard(this.doppelgangerA);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.doppelgangerB);

            // First resolution for Doppelganger A - can't break out of loop yet
            expect(this.player1).not.toHavePromptButton('Move Doppelganger to discard pile');
            this.player1.clickCard(this.umbra);

            // First resolution for Doppelganger B - can't break out of loop yet
            expect(this.player1).not.toHavePromptButton('Move Doppelganger to discard pile');
            this.player1.clickCard(this.huntingWitch);
            this.player1.clickPrompt('geistoid');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should offer the infinite-loop escape when the same Doppelganger re-resolves in the same start-of-turn window', function () {
            // First resolution for Doppelganger A - can't break out of loop yet
            this.player1.clickCard(this.doppelgangerA);
            expect(this.player1).not.toHavePromptButton('Move Doppelganger to discard pile');
            this.player1.clickCard(this.doppelgangerB);

            // Second resolution for Doppelganger A - can break out of loop
            this.player1.clickCard(this.doppelgangerA);
            expect(this.player1).toHavePromptButton('Move Doppelganger to discard pile');
            this.player1.clickCard(this.doppelgangerB);

            // First resolution for Doppelganger B - can't break out of loop yet
            this.player1.clickCard(this.doppelgangerB);
            expect(this.player1).not.toHavePromptButton('Move Doppelganger to discard pile');
            this.player1.clickCard(this.doppelgangerA);

            // Second resolution for Doppelganger B - can break out of loop
            this.player1.clickCard(this.doppelgangerB);
            expect(this.player1).toHavePromptButton('Move Doppelganger to discard pile');
            this.player1.clickPrompt('Move Doppelganger to discard pile');
            expect(this.doppelgangerA.location).toBe('play area');
            expect(this.doppelgangerB.location).toBe('discard');

            // Doppelganger A is no longer in a potential loop
            expect(this.player1).not.toHavePromptButton('Move Doppelganger to discard pile');
            this.player1.clickCard(this.huntingWitch);
            this.player1.clickPrompt('geistoid');
            expect(this.player1).isReadyToTakeAction();
            expect(this.doppelgangerA.location).toBe('play area');
            expect(this.doppelgangerB.location).toBe('discard');
        });

        it('should not offer the infinite-loop escape on the first resolution of a fresh turn even after a prior loop turn', function () {
            // First resolution for Doppelganger A - can't break out of loop yet
            this.player1.clickCard(this.doppelgangerA);
            expect(this.player1).not.toHavePromptButton('Move Doppelganger to discard pile');
            this.player1.clickCard(this.doppelgangerB);

            // First resolution for Doppelganger B - can't break out of loop yet
            this.player1.clickCard(this.doppelgangerB);
            expect(this.player1).not.toHavePromptButton('Move Doppelganger to discard pile');
            this.player1.clickCard(this.doppelgangerA);

            // Second resolution for Doppelganger A - can break out of loop
            this.player1.clickCard(this.doppelgangerA);
            expect(this.player1).toHavePromptButton('Move Doppelganger to discard pile');
            this.player1.clickCard(this.umbra);

            // Second resolution for Doppelganger B - can break out of loop
            this.player1.clickCard(this.doppelgangerB);
            expect(this.player1).toHavePromptButton('Move Doppelganger to discard pile');
            this.player1.clickCard(this.huntingWitch);
            this.player1.clickCard(this.huntingWitch); // Doppelganger B copied two gain text box from A

            this.player1.clickPrompt('geistoid');
            expect(this.doppelgangerA.location).toBe('play area');
            expect(this.doppelgangerB.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            // First resolutions for this turn - cannot break out of infinite loop yet
            this.player1.clickCard(this.doppelgangerA);
            expect(this.player1).not.toHavePromptButton('Move Doppelganger to discard pile');
            this.player1.clickCard(this.umbra);
            expect(this.player1).not.toHavePromptButton('Move Doppelganger to discard pile');
            this.player1.clickCard(this.huntingWitch);
            this.player1.clickPrompt('geistoid');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Doppelganger interacting with Mimic Gel copies', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['mimic-gel'],
                    inPlay: ['doppelganger']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should recognize Mimic Gel as a gains-text-box card when it copies Doppelganger', function () {
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.doppelganger);
            this.player1.clickPrompt('Right');

            expect(this.mimicGel.hasGainsTextBoxAbility()).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            this.player1.clickCard(this.mimicGel);
            this.player1.clickCard(this.doppelganger);
            this.player1.clickCard(this.mimicGel);
            expect(this.player1).toHavePromptButton(
                'Move Mimic Gel as Doppelganger to discard pile'
            );
            this.player1.clickPrompt('Move Mimic Gel as Doppelganger to discard pile');
            expect(this.mimicGel.location).toBe('discard');
            this.player1.clickPrompt('logos');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Doppelganger blanked by Shadow of Dis', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['doppelganger', 'umbra']
                },
                player2: {
                    house: 'dis',
                    hand: ['shadow-of-dis']
                }
            });
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.endTurn();
        });

        it('should not trigger its reaction or expose a gains-text-box ability while blanked', function () {
            expect(this.doppelganger.isBlank()).toBe(true);
            expect(this.doppelganger.hasGainsTextBoxAbility()).toBe(false);
            expect(this.player1).toHavePrompt('Choose which house you want to activate this turn');
            this.player1.clickPrompt('geistoid');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Doppelganger copying upgrade-granted abilities', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    hand: [
                        'armored-spikes',
                        'strength-within',
                        'pendra-s-box',
                        'static-charge',
                        'backup-copy'
                    ],
                    inPlay: ['troll']
                },
                player2: {
                    amber: 1,
                    inPlay: ['hunting-witch', 'doppelganger']
                }
            });
        });

        it("should gain keywords granted by neighbor's upgrades, but not non-keyword effects", function () {
            this.player1.clickPrompt('brobnar');
            this.player1.playUpgrade(this.armoredSpikes, this.huntingWitch);
            expect(this.huntingWitch.getKeywordValue('hazardous')).toBe(2);
            expect(this.huntingWitch.armor).toBe(2);
            this.player1.endTurn();

            this.player2.clickCard(this.huntingWitch);
            expect(this.doppelganger.getKeywordValue('hazardous')).toBe(2);
            expect(this.doppelganger.armor).toBe(0);
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });

        it("should gain a persistent effect granted by neighbor's upgrade", function () {
            this.player1.clickPrompt('brobnar');
            this.player1.playUpgrade(this.strengthWithin, this.huntingWitch);
            this.player1.endTurn();

            this.player2.clickCard(this.huntingWitch);
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();

            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            this.huntingWitch.damage = 1;
            expect(this.player1.player.getCurrentKeyCost()).toBe(7);
            this.doppelganger.damage = 2;
            expect(this.player1.player.getCurrentKeyCost()).toBe(9);
        });

        it("should gain an after-reap ability granted by neighbor's upgrade (Pendra's Box)", function () {
            this.player1.clickPrompt('dis');
            this.player1.playUpgrade(this.pendraSBox, this.huntingWitch);
            this.player1.endTurn();

            this.player2.clickCard(this.huntingWitch);
            this.player2.clickPrompt('geistoid');

            this.player2.reap(this.doppelganger);
            expect(this.player2.player.amber).toBe(2);
            expect(this.doppelganger.amber).toBe(1);
            expect(this.huntingWitch.amber).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });

        it("should gain a start-of-turn reaction granted by neighbor's upgrade", function () {
            this.player1.clickPrompt('logos');
            this.player1.playUpgrade(this.staticCharge, this.huntingWitch);
            this.player1.endTurn();

            this.player2.clickCard(this.doppelganger);
            this.player2.clickCard(this.huntingWitch); // copy
            this.player2.clickCard(this.doppelganger); // static charge
            this.player2.clickPrompt('geistoid');

            expect(this.doppelganger.damage).toBe(0);
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it("should gain a destroyed ability granted by neighbor's upgrade", function () {
            this.player1.clickPrompt('logos');
            this.player1.playUpgrade(this.backupCopy, this.huntingWitch);
            this.player1.endTurn();

            this.player2.clickCard(this.huntingWitch);
            this.player2.clickPrompt('geistoid');

            this.player2.fightWith(this.doppelganger, this.troll);
            expect(this.doppelganger.location).toBe('deck');
            expect(this.player2.player.deck[0]).toBe(this.doppelganger);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
