describe('Soulkeeper', function () {
    describe("Soulkeeper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['shooler', 'old-yurk'],
                    hand: ['soulkeeper']
                },
                player2: {
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });

        it('should destroy the most powerful enemy creature when the creature it is attached to dies', function () {
            this.player1.playUpgrade(this.soulkeeper, this.oldYurk);
            this.player1.fightWith(this.oldYurk, this.troll);
            expect(this.player1).toHavePrompt('Soulkeeper');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.troll);
            expect(this.oldYurk.location).toBe('discard');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
        });
    });
    describe("Soulkeeper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['shooler', 'old-yurk'],
                    hand: ['soulkeeper']
                },
                player2: {
                    inPlay: ['nexus', 'bilgum-avalanche', 'yantzee-gang', 'dodger']
                }
            });
        });

        it('should allow the choice between enemy creatures when two or more have the highest power', function () {
            this.player1.playUpgrade(this.soulkeeper, this.oldYurk);
            this.player1.fightWith(this.oldYurk, this.bilgumAvalanche);
            expect(this.player1).toHavePrompt('Soulkeeper');
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.yantzeeGang);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            expect(this.player1).not.toBeAbleToSelect(this.bilgumAvalanche);
            expect(this.bilgumAvalanche.location).toBe('play area');
            this.player1.clickCard(this.yantzeeGang);
            expect(this.oldYurk.location).toBe('discard');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.bilgumAvalanche.location).toBe('discard');
            expect(this.yantzeeGang.location).toBe('discard');
        });
    });
    describe("Soulkeeper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['shooler', 'old-yurk'],
                    hand: ['soulkeeper', 'pawn-sacrifice']
                },
                player2: {
                    inPlay: ['nexus', 'bilgum-avalanche', 'yantzee-gang']
                }
            });
        });

        it('should fire when the creature is sacrificed', function () {
            this.player1.playUpgrade(this.soulkeeper, this.oldYurk);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.play(this.pawnSacrifice);
            expect(this.player1).toHavePrompt('Choose a creature to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.oldYurk);
            this.player1.clickCard(this.oldYurk);
            expect(this.player1).toHavePrompt('Soulkeeper');
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.yantzeeGang);
            expect(this.player1).toBeAbleToSelect(this.bilgumAvalanche);
            this.player1.clickCard(this.yantzeeGang);
            expect(this.player1).toHavePrompt('Choose 2 creatures');
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.bilgumAvalanche);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            this.player1.clickCard(this.nexus);
            this.player1.clickCard(this.bilgumAvalanche);
            this.player1.clickPrompt('Done');
            expect(this.oldYurk.location).toBe('discard');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.yantzeeGang.location).toBe('discard');
        });
    });

    describe('when the most powerful enemy creature is tagged for destruction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['old-yurk'],
                    hand: ['soulkeeper']
                },
                player2: {
                    inPlay: ['bilgum-avalanche', 'nexus', 'helper-bot']
                }
            });
        });

        it('should target the tagged-for-destruction creature when it is the only most powerful', function () {
            this.player1.playUpgrade(this.soulkeeper, this.oldYurk);
            this.oldYurk.ready();
            this.player1.fightWith(this.oldYurk, this.bilgumAvalanche);
            // Bilgum Avalanche is the only most-powerful enemy and is already
            // tagged for destruction from the fight. The selector falls back to allowing the
            // tagged-for-destruction top-power creature so a target exists, and the player
            // is prompted to confirm it.
            expect(this.player1).toHavePrompt('Soulkeeper');
            expect(this.player1).toBeAbleToSelect(this.bilgumAvalanche);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            this.player1.clickCard(this.bilgumAvalanche);
            expect(this.oldYurk.location).toBe('discard');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.bilgumAvalanche.location).toBe('discard');
            expect(this.nexus.location).toBe('play area');
            expect(this.helperBot.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when one of multiple most-powerful creatures is tagged for destruction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['old-yurk'],
                    hand: ['soulkeeper']
                },
                player2: {
                    inPlay: ['bilgum-avalanche', 'yantzee-gang', 'dodger', 'nexus']
                }
            });
        });

        it('should let the player choose between the untagged most-powerful creatures', function () {
            this.player1.playUpgrade(this.soulkeeper, this.oldYurk);
            this.player1.fightWith(this.oldYurk, this.bilgumAvalanche);
            expect(this.player1).toHavePrompt('Soulkeeper');
            expect(this.player1).not.toBeAbleToSelect(this.bilgumAvalanche);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.yantzeeGang);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.yantzeeGang);
            expect(this.bilgumAvalanche.location).toBe('discard');
            expect(this.yantzeeGang.location).toBe('discard');
            expect(this.dodger.location).toBe('play area');
            expect(this.nexus.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
