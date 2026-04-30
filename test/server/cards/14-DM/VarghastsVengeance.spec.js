describe("Varghast's Vengeance", function () {
    describe("Varghast's Vengeance omni - play prevention", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['varghast-s-vengeance'],
                    hand: ['echofly', 'boiler']
                },
                player2: {
                    hand: ['echofly', 'shadys']
                }
            });
            this.echoflyP1 = this.player1.findCardByName('Echofly', 'hand');
            this.echoflyP2 = this.player2.findCardByName('Echofly', 'hand');
        });

        it('prompts for a card name and gains 2 chains', function () {
            this.player1.useOmni(this.varghastSVengeance);
            this.player1.selectCardName('Echofly');
            expect(this.player1.player.chains).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('prevents named card from being played until the start of the next turn', function () {
            // Before omni: active player can play either of their cards.
            this.player1.clickCard(this.echoflyP1);
            expect(this.player1).toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Cancel');
            this.player1.clickCard(this.boiler);
            expect(this.player1).toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Cancel');
            this.player1.useOmni(this.varghastSVengeance);
            this.player1.selectCardName('Echofly');

            // Active player cannot play the named card, but can play a different one.
            this.player1.clickCard(this.echoflyP1);
            expect(this.player1).not.toHavePromptButton('Play this creature');
            expect(this.player1).toHavePromptButton('Discard this card');
            this.player1.clickPrompt('Cancel');
            this.player1.clickCard(this.boiler);
            expect(this.player1).toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Cancel');
            this.player1.endTurn();

            // Opponent cannot play the named card, but can play a different one.
            this.player2.clickPrompt('geistoid');
            this.player2.clickCard(this.echoflyP2);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            expect(this.player2).toHavePromptButton('Discard this card');
            this.player2.clickPrompt('Cancel');
            this.player2.clickCard(this.shadys);
            expect(this.player2).toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Cancel');
            this.player2.endTurn();

            // Effect expires at the start of the active player's next turn.
            this.player1.clickPrompt('geistoid');
            this.player1.clickCard(this.echoflyP1);
            expect(this.player1).toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Cancel');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Varghast's Vengeance omni - use prevention", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['varghast-s-vengeance', 'echofly', 'boiler']
                },
                player2: {
                    inPlay: ['echofly', 'shadys']
                }
            });
            this.echoflyP1 = this.player1.findCardByName('Echofly', 'play area');
            this.echoflyP2 = this.player2.findCardByName('Echofly', 'play area');
        });

        it('prevents the named creature from being used until the start of the next turn', function () {
            // Before omni: active player can use either of their creatures.
            this.player1.clickCard(this.echoflyP1);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Cancel');
            this.player1.clickCard(this.boiler);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Cancel');
            this.player1.useOmni(this.varghastSVengeance);
            this.player1.selectCardName('Echofly');

            // Active player cannot use the named creature, but can use a different one.
            this.player1.clickCard(this.echoflyP1);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
            this.player1.clickCard(this.boiler);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Cancel');
            this.player1.endTurn();

            // Opponent cannot use the named creature, but can use a different one.
            this.player2.clickPrompt('geistoid');
            this.player2.clickCard(this.echoflyP2);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            expect(this.player2).not.toHavePromptButton('Fight with this creature');
            this.player2.clickCard(this.shadys);
            expect(this.player2).toHavePromptButton('Reap with this creature');
            this.player2.clickPrompt('Cancel');
            this.player2.endTurn();

            // Effect expires at the start of the active player's next turn.
            this.player1.clickPrompt('geistoid');
            this.player1.clickCard(this.echoflyP1);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Cancel');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Varghast's Vengeance scrap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['varghast-s-vengeance']
                },
                player2: {
                    discard: ['troll', 'bumpsy', 'krump']
                }
            });
        });

        it('purges a card from opponent discard then shuffles their discard into deck', function () {
            const opponentDeckBefore = this.player2.player.deck.length;
            this.player1.scrap(this.varghastSVengeance);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('purged');
            expect(this.bumpsy.location).toBe('deck');
            expect(this.krump.location).toBe('deck');
            expect(this.player2.player.deck.length).toBe(opponentDeckBefore + 2);
            expect(this.varghastSVengeance.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Varghast's Vengeance scrap with empty discard", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['varghast-s-vengeance']
                },
                player2: {
                    deck: ['troll', 'bumpsy', 'krump']
                }
            });
        });

        it('still shuffles opponent deck when their discard is empty', function () {
            const shuffleSpy = vi.spyOn(this.player2.player, 'shuffleDeck');
            this.player1.scrap(this.varghastSVengeance);
            expect(this.player1).isReadyToTakeAction();
            expect(this.varghastSVengeance.location).toBe('discard');
            expect(shuffleSpy).toHaveBeenCalled();
        });
    });
});
