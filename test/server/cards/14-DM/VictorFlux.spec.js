describe('Victor Flux', function () {
    describe("Victor Flux's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['victor-flux'],
                    discard: ['urchin']
                },
                player2: {
                    hand: ['troll', 'bumpsy', 'wild-wormhole']
                }
            });
        });

        it('prevents opponent from playing creatures next turn after purging a creature', function () {
            this.player1.reap(this.victorFlux);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('purged');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.troll);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            expect(this.player2).toHavePromptButton('Discard this card');
            this.player2.clickPrompt('Cancel');
            expect(this.player2).isReadyToTakeAction();
        });

        it('allows opponent to play non-creature cards after purging a creature', function () {
            this.player1.reap(this.victorFlux);
            this.player1.clickCard(this.urchin);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.wildWormhole);
            expect(this.wildWormhole.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does nothing if no card is purged', function () {
            this.player1.moveCard(this.urchin, 'hand');
            this.player1.reap(this.victorFlux);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does nothing if discard pile is empty', function () {
            this.player1.moveCard(this.urchin, 'deck');
            expect(this.player1.player.discard.length).toBe(0);
            this.player1.reap(this.victorFlux);
            expect(this.player1).isReadyToTakeAction();
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.troll);
            expect(this.troll.location).toBe('play area');
            this.player2.play(this.bumpsy);
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('Victor Flux purging non-creature card types', function () {
        it('prevents opponent from playing actions next turn after purging an action', function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['victor-flux'],
                    discard: ['anger']
                },
                player2: {
                    inPlay: ['troll'],
                    hand: ['dimension-door', 'bumpsy']
                }
            });
            this.player1.reap(this.victorFlux);
            this.player1.clickCard(this.anger);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.clickCard(this.dimensionDoor);
            expect(this.player2).not.toHavePromptButton('Play this action');
            this.player2.clickPrompt('Cancel');
            expect(this.dimensionDoor.location).toBe('hand');
            expect(this.player2).isReadyToTakeAction();
        });

        it('prevents opponent from playing artifacts next turn after purging an artifact', function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['victor-flux'],
                    discard: ['cannon']
                },
                player2: {
                    hand: ['autocannon', 'troll']
                }
            });
            this.player1.reap(this.victorFlux);
            this.player1.clickCard(this.cannon);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.autocannon);
            expect(this.autocannon.location).toBe('hand');
            this.player2.play(this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });

        it('prevents opponent from playing upgrades next turn after purging an upgrade', function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['victor-flux'],
                    discard: ['phoenix-heart']
                },
                player2: {
                    inPlay: ['troll'],
                    hand: ['blood-of-titans', 'bumpsy']
                }
            });
            this.player1.reap(this.victorFlux);
            this.player1.clickCard(this.phoenixHeart);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.bloodOfTitans);
            expect(this.bloodOfTitans.location).toBe('hand');
            this.player2.play(this.bumpsy);
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
