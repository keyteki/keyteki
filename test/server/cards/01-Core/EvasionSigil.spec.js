describe('Evasion Sigil', function () {
    describe("Evasion Sigil's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['dextre', 'batdrone', 'sanitation-engineer'],
                    discard: ['troll']
                },
                player2: {
                    inPlay: [
                        'evasion-sigil',
                        'sequis',
                        'niffle-ape',
                        'ancient-bear',
                        'briar-grubbling'
                    ]
                }
            });

            this.player1.moveCard(this.troll, 'deck');
        });

        it("should allow creatures to attack when the top card is a different house, and stop them when it's the same", function () {
            this.player1.fightWith(this.dextre, this.sequis);
            expect(this.troll.location).toBe('discard');
            expect(this.dextre.location).toBe('deck');
            expect(this.sequis.damage).toBe(1);
            this.player1.fightWith(this.batdrone, this.sequis);
            expect(this.dextre.location).toBe('discard');
            expect(this.batdrone.location).toBe('play area');
            expect(this.batdrone.exhausted).toBe(true);
            expect(this.sequis.damage).toBe(1);
        });

        it('should apply to both players', function () {
            this.player2.moveCard(this.ancientBear, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.niffleApe, this.batdrone);
            expect(this.ancientBear.location).toBe('discard');
            expect(this.batdrone.location).toBe('play area');
            expect(this.batdrone.damage).toBe(0);
            expect(this.niffleApe.exhausted).toBe(true);
            expect(this.niffleApe.damage).toBe(0);
        });

        it('should prompt for active player when attacker has assault', function () {
            this.player2.moveCard(this.niffleApe, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.ancientBear, this.dextre);
            expect(this.player2).toBeAbleToSelect(this.ancientBear);
            expect(this.player2).toBeAbleToSelect(this.evasionSigil);
            this.player2.clickCard(this.ancientBear);
            expect(this.niffleApe.location).toBe('discard');
            expect(this.ancientBear.location).toBe('play area');
            expect(this.dextre.location).toBe('play area');
            expect(this.dextre.damage).toBe(2);
            expect(this.ancientBear.exhausted).toBe(true);
            expect(this.ancientBear.damage).toBe(0);
        });

        it('should prompt for active player when attacker has assault and select ES first', function () {
            this.player2.moveCard(this.niffleApe, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.ancientBear, this.dextre);
            expect(this.player2).toBeAbleToSelect(this.ancientBear);
            expect(this.player2).toBeAbleToSelect(this.evasionSigil);
            this.player2.clickCard(this.evasionSigil);
            expect(this.niffleApe.location).toBe('discard');
            expect(this.ancientBear.location).toBe('play area');
            expect(this.dextre.location).toBe('play area');
            expect(this.dextre.damage).toBe(2);
            expect(this.ancientBear.exhausted).toBe(true);
            expect(this.ancientBear.damage).toBe(0);
        });

        it('should prompt for active player when defender has hazardous', function () {
            this.player2.moveCard(this.ancientBear, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.niffleApe, this.sanitationEngineer);
            expect(this.player2).toBeAbleToSelect(this.sanitationEngineer);
            expect(this.player2).toBeAbleToSelect(this.evasionSigil);
            this.player2.clickCard(this.evasionSigil);
            expect(this.ancientBear.location).toBe('discard');
            expect(this.niffleApe.location).toBe('play area');
            expect(this.sanitationEngineer.location).toBe('play area');
            expect(this.sanitationEngineer.damage).toBe(0);
            expect(this.niffleApe.exhausted).toBe(true);
            expect(this.niffleApe.damage).toBe(1);
        });

        it('should prompt for active player when defender has hazardous and select ES first', function () {
            this.player2.moveCard(this.ancientBear, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.niffleApe, this.sanitationEngineer);
            expect(this.player2).toBeAbleToSelect(this.sanitationEngineer);
            expect(this.player2).toBeAbleToSelect(this.evasionSigil);
            this.player2.clickCard(this.evasionSigil);
            expect(this.ancientBear.location).toBe('discard');
            expect(this.niffleApe.location).toBe('play area');
            expect(this.sanitationEngineer.location).toBe('play area');
            expect(this.sanitationEngineer.damage).toBe(0);
            expect(this.niffleApe.exhausted).toBe(true);
            expect(this.niffleApe.damage).toBe(1);
        });

        it('should prompt for active player when attacker has assault, defender has hazardous', function () {
            this.player2.moveCard(this.niffleApe, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.ancientBear, this.sanitationEngineer);
            expect(this.player2).toBeAbleToSelect(this.ancientBear);
            expect(this.player2).toBeAbleToSelect(this.sanitationEngineer);
            expect(this.player2).toBeAbleToSelect(this.evasionSigil);
            this.player2.clickCard(this.ancientBear);
            expect(this.player2).not.toBeAbleToSelect(this.ancientBear);
            expect(this.player2).toBeAbleToSelect(this.sanitationEngineer);
            expect(this.player2).toBeAbleToSelect(this.evasionSigil);
            this.player2.clickCard(this.evasionSigil);
            expect(this.niffleApe.location).toBe('discard');
            expect(this.ancientBear.location).toBe('play area');
            expect(this.sanitationEngineer.location).toBe('play area');
            expect(this.sanitationEngineer.damage).toBe(2);
            expect(this.ancientBear.exhausted).toBe(true);
            expect(this.ancientBear.damage).toBe(1);
        });
    });

    describe("Two evasion Sigil's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['dextre', 'batdrone', 'sanitation-engineer'],
                    discard: ['troll', 'brammo']
                },
                player2: {
                    inPlay: [
                        'evasion-sigil',
                        'evasion-sigil',
                        'sequis',
                        'niffle-ape',
                        'ancient-bear',
                        'briar-grubbling'
                    ]
                }
            });

            this.evasionSigil1 = this.player2.inPlay[0];
            this.evasionSigil2 = this.player2.inPlay[1];
        });

        it('should not stop the fight if both discarded cards are from different houses', function () {
            this.player1.moveCard(this.troll, 'deck');
            this.player1.moveCard(this.brammo, 'deck');
            this.player1.fightWith(this.dextre, this.sequis);
            expect(this.player1).toBeAbleToSelect(this.evasionSigil1);
            expect(this.player1).toBeAbleToSelect(this.evasionSigil2);
            this.player1.clickCard(this.evasionSigil1);
            expect(this.troll.location).toBe('discard');
            expect(this.brammo.location).toBe('discard');
            expect(this.dextre.location).toBe('deck');
            expect(this.sequis.damage).toBe(1);
        });

        it('should discard two cards and stop the fight if first discarded card is from same house', function () {
            this.player1.moveCard(this.brammo, 'deck');
            this.player1.moveCard(this.batdrone, 'deck');
            this.player1.fightWith(this.dextre, this.sequis);
            expect(this.player1).toBeAbleToSelect(this.evasionSigil1);
            expect(this.player1).toBeAbleToSelect(this.evasionSigil2);
            this.player1.clickCard(this.evasionSigil1);
            expect(this.batdrone.location).toBe('discard');
            expect(this.brammo.location).toBe('discard');
            expect(this.dextre.location).toBe('play area');
        });

        it('should discard two cards and stop the fight if second discarded card is from same house', function () {
            this.player1.moveCard(this.batdrone, 'deck');
            this.player1.moveCard(this.brammo, 'deck');
            this.player1.fightWith(this.dextre, this.sequis);
            expect(this.player1).toBeAbleToSelect(this.evasionSigil1);
            expect(this.player1).toBeAbleToSelect(this.evasionSigil2);
            this.player1.clickCard(this.evasionSigil2);
            expect(this.batdrone.location).toBe('discard');
            expect(this.brammo.location).toBe('discard');
            expect(this.dextre.location).toBe('play area');
        });

        it('should discard two cards and stop the fight if both discarded cards are from same house', function () {
            this.player1.moveCard(this.batdrone, 'deck');
            this.player1.moveCard(this.sanitationEngineer, 'deck');
            this.player1.fightWith(this.dextre, this.sequis);
            expect(this.player1).toBeAbleToSelect(this.evasionSigil1);
            expect(this.player1).toBeAbleToSelect(this.evasionSigil2);
            this.player1.clickCard(this.evasionSigil2);
            expect(this.batdrone.location).toBe('discard');
            expect(this.sanitationEngineer.location).toBe('discard');
            expect(this.dextre.location).toBe('play area');
        });
    });
});
