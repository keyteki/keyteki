describe('Victor Flux', function () {
    describe("Victor Flux's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['victor-flux'],
                    discard: ['urchin', 'dimension-door', 'cannon', 'phoenix-heart']
                },
                player2: {
                    inPlay: ['bumpsy'],
                    hand: ['troll', 'barn-razing', 'autocannon', 'blood-of-titans']
                }
            });
        });

        it('prevents creatures and allows other types after purging a creature', function () {
            const messageCountBefore = this.game.messages.length;
            this.player1.reap(this.victorFlux);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('purged');
            const alert = this.game.messages
                .slice(messageCountBefore)
                .find((entry) => entry.message && entry.message.alert);
            expect(alert).toBeDefined();
            expect(alert.message.alert.type).toBe('bell');
            const alertText = JSON.stringify(alert.message);
            expect(alertText).toContain('"name":"player1"');
            expect(alertText).toContain('Victor Flux');
            expect(alertText).toContain('"name":"player2"');
            expect(alertText).toContain('from playing cards of type');
            expect(alertText).toContain('creature');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');

            this.player2.clickCard(this.troll);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            expect(this.player2).toHavePromptButton('Discard this card');
            this.player2.clickPrompt('Cancel');
            expect(this.troll.location).toBe('hand');

            this.player2.play(this.barnRazing);
            expect(this.barnRazing.location).toBe('discard');
            this.player2.play(this.autocannon);
            expect(this.autocannon.location).toBe('play area');
            this.player2.playUpgrade(this.bloodOfTitans, this.bumpsy);
            expect(this.bloodOfTitans.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });

        it('prevents actions and allows other types after purging an action', function () {
            this.player1.reap(this.victorFlux);
            this.player1.clickCard(this.dimensionDoor);
            expect(this.dimensionDoor.location).toBe('purged');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');

            this.player2.clickCard(this.barnRazing);
            expect(this.player2).not.toHavePromptButton('Play this action');
            expect(this.player2).toHavePromptButton('Discard this card');
            this.player2.clickPrompt('Cancel');
            expect(this.barnRazing.location).toBe('hand');

            this.player2.play(this.troll);
            expect(this.troll.location).toBe('play area');
            this.player2.play(this.autocannon);
            expect(this.autocannon.location).toBe('play area');
            this.player2.playUpgrade(this.bloodOfTitans, this.bumpsy);
            expect(this.bloodOfTitans.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });

        it('prevents artifacts and allows other types after purging an artifact', function () {
            this.player1.reap(this.victorFlux);
            this.player1.clickCard(this.cannon);
            expect(this.cannon.location).toBe('purged');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');

            this.player2.clickCard(this.autocannon);
            expect(this.player2).not.toHavePromptButton('Play this artifact');
            expect(this.player2).toHavePromptButton('Discard this card');
            this.player2.clickPrompt('Cancel');
            expect(this.autocannon.location).toBe('hand');

            this.player2.play(this.troll);
            expect(this.troll.location).toBe('play area');
            this.player2.play(this.barnRazing);
            expect(this.barnRazing.location).toBe('discard');
            this.player2.playUpgrade(this.bloodOfTitans, this.bumpsy);
            expect(this.bloodOfTitans.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });

        it('prevents upgrades and allows other types after purging an upgrade', function () {
            this.player1.reap(this.victorFlux);
            this.player1.clickCard(this.phoenixHeart);
            expect(this.phoenixHeart.location).toBe('purged');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');

            this.player2.clickCard(this.bloodOfTitans);
            expect(this.player2).not.toHavePromptButton('Play this upgrade');
            expect(this.player2).toHavePromptButton('Discard this card');
            this.player2.clickPrompt('Cancel');
            expect(this.bloodOfTitans.location).toBe('hand');

            this.player2.play(this.troll);
            expect(this.troll.location).toBe('play area');
            this.player2.play(this.barnRazing);
            expect(this.barnRazing.location).toBe('discard');
            this.player2.play(this.autocannon);
            expect(this.autocannon.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does nothing if no card is purged', function () {
            const messageCountBefore = this.game.messages.length;
            this.player1.moveCard(this.urchin, 'hand');
            this.player1.moveCard(this.dimensionDoor, 'hand');
            this.player1.moveCard(this.cannon, 'hand');
            this.player1.moveCard(this.phoenixHeart, 'hand');
            this.player1.reap(this.victorFlux);
            const alert = this.game.messages
                .slice(messageCountBefore)
                .find((entry) => entry.message && entry.message.alert);
            expect(alert).toBeUndefined();
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });

        it('cannot purge cards from hand', function () {
            this.player1.moveCard(this.dimensionDoor, 'hand');
            this.player1.moveCard(this.cannon, 'hand');
            this.player1.moveCard(this.phoenixHeart, 'hand');
            this.player1.reap(this.victorFlux);
            this.player1.clickCard(this.dimensionDoor);
            expect(this.dimensionDoor.location).toBe('hand');
            this.player1.clickCard(this.cannon);
            expect(this.cannon.location).toBe('hand');
            this.player1.clickCard(this.phoenixHeart);
            expect(this.phoenixHeart.location).toBe('hand');
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('purged');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.troll);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Cancel');
        });
    });

    describe('Victor Flux blocking Wild Wormhole', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['victor-flux'],
                    discard: ['urchin']
                },
                player2: {
                    hand: ['wild-wormhole', 'troll']
                }
            });
            this.player2.moveCard(this.troll, 'deck');
        });

        it('plays Wild Wormhole but blocks the top-of-deck creature, leaving it on the deck', function () {
            this.player1.reap(this.victorFlux);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('purged');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.wildWormhole);
            expect(this.wildWormhole.location).toBe('discard');
            expect(this.troll.location).toBe('deck');
            expect(this.player2.player.deck[0]).toBe(this.troll);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('Victor Flux with creatures playable as upgrades', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['victor-flux'],
                    discard: ['urchin', 'phoenix-heart']
                },
                player2: {
                    house: 'staralliance',
                    inPlay: ['dust-pixie'],
                    hand: ['pupgrade']
                }
            });
        });

        it('still allows a creature playable as an upgrade to be played as an upgrade after purging a creature', function () {
            this.player1.reap(this.victorFlux);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('purged');
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.clickCard(this.pupgrade);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            expect(this.player2).toHavePromptButton('Play this upgrade');
            this.player2.clickPrompt('Play this upgrade');
            this.player2.clickCard(this.dustPixie);
            expect(this.pupgrade.location).toBe('play area');
            expect(this.pupgrade.parent).toBe(this.dustPixie);
            expect(this.player2).isReadyToTakeAction();
        });

        it('allows playing such a creature as a creature after purging an upgrade, but not as an upgrade', function () {
            this.player1.reap(this.victorFlux);
            this.player1.clickCard(this.phoenixHeart);
            expect(this.phoenixHeart.location).toBe('purged');
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.clickCard(this.pupgrade);
            expect(this.player2).toHavePromptButton('Play this creature');
            expect(this.player2).not.toHavePromptButton('Play this upgrade');
            this.player2.clickPrompt('Play this creature');
            this.player2.clickPrompt('Right');
            expect(this.pupgrade.location).toBe('play area');
            expect(this.pupgrade.type).toBe('creature');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
