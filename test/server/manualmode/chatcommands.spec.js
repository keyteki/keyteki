describe('Chat Commands', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: ['logos'],
                hand: ['titan-mechanic', 'hunting-witch', 'lamindra'],
                inPlay: ['niffle-ape'],
                discard: ['ancient-bear']
            },
            player2: {
                inPlay: ['batdrone'],
                hand: ['dextre']
            }
        });

        this.game.manualMode = true;
    });

    describe('/active-house', function () {
        it('to change active house', function () {
            expect(this.player1.activeHouse, 'logos');
            expect(this.player1.executeCommand('/active-house untamed')).toBe(true);
            expect(this.player1.activeHouse, 'untamed');
        });

        it('to change active house using a house not in deck', function () {
            expect(this.player1.activeHouse, 'logos');
            expect(this.player1.executeCommand('/active-house brobnar')).toBe(true);
            expect(this.player1.activeHouse, 'brobnar');
        });

        it('to change active house using an invalid house', function () {
            expect(this.player1.activeHouse, 'logos');
            expect(this.player1.executeCommand('/active-house invalid')).toBe(false);
            expect(this.player1.activeHouse, 'logos');
        });

        it('to change active house of non active player', function () {
            expect(this.player2.executeCommand('/active-house invalid')).toBe(false);
        });
    });

    describe('/add-card', function () {
        it('to add a card to hand using ID only', function () {
            expect(this.player1.hand.some((card) => card.id === 'gateway-to-dis')).toBe(false);
            expect(this.player1.executeCommand('/add-card gateway-to-dis')).toBe(true);
            expect(this.player1.hand.some((card) => card.id === 'gateway-to-dis')).toBe(true);
        });

        it('to add a card to hand using NAME only', function () {
            expect(this.player1.hand.some((card) => card.id === 'gateway-to-dis')).toBe(false);
            expect(this.player1.executeCommand('/add-card Gateway to dis')).toBe(true);
            expect(this.player1.hand.some((card) => card.id === 'gateway-to-dis')).toBe(true);
        });

        it('to add a card to hand using ID and location', function () {
            expect(this.player1.hand.some((card) => card.id === 'gateway-to-dis')).toBe(false);
            expect(this.player1.executeCommand('/add-card hand gateway-to-dis')).toBe(true);
            expect(this.player1.hand.some((card) => card.id === 'gateway-to-dis')).toBe(true);
        });

        it('to add a card to hand using NAME and location', function () {
            expect(this.player1.hand.some((card) => card.id === 'gateway-to-dis')).toBe(false);
            expect(this.player1.executeCommand('/add-card hand Gateway to dis')).toBe(true);
            expect(this.player1.hand.some((card) => card.id === 'gateway-to-dis')).toBe(true);
        });

        it('to add a card to deck using ID and location', function () {
            expect(this.player1.deck.some((card) => card.id === 'gateway-to-dis')).toBe(false);
            expect(this.player1.executeCommand('/add-card deck gateway-to-dis')).toBe(true);
            expect(this.player1.deck.some((card) => card.id === 'gateway-to-dis')).toBe(true);
        });

        it('to add a card to deck using NAME and location', function () {
            expect(this.player1.deck.some((card) => card.id === 'gateway-to-dis')).toBe(false);
            expect(this.player1.executeCommand('/add-card deck Gateway to dis')).toBe(true);
            expect(this.player1.deck.some((card) => card.id === 'gateway-to-dis')).toBe(true);
        });

        it('to add a card by player 2', function () {
            expect(this.player2.deck.some((card) => card.id === 'gateway-to-dis')).toBe(false);
            expect(this.player2.executeCommand('/add-card deck Gateway to dis')).toBe(true);
            expect(this.player2.deck.some((card) => card.id === 'gateway-to-dis')).toBe(true);
        });
    });

    describe('/draw', function () {
        it('to draw nothing is pass 0', function () {
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1.executeCommand('/draw 0')).toBe(false);
            expect(this.player1.hand.length).toBe(3);
        });

        it('to draw a default (1) number of cards', function () {
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1.executeCommand('/draw')).toBe(true);
            expect(this.player1.hand.length).toBe(4);
        });

        it('to draw a default (1) number of cards when using invalid values', function () {
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1.executeCommand('/draw -3')).toBe(true);
            expect(this.player1.hand.length).toBe(4);
            expect(this.player1.executeCommand('/draw NaN')).toBe(true);
            expect(this.player1.hand.length).toBe(5);
        });

        it('to draw X number of cards', function () {
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1.executeCommand('/draw 3')).toBe(true);
            expect(this.player1.hand.length).toBe(6);
        });

        it('to draw cards by player 2', function () {
            expect(this.player2.hand.length).toBe(1);
            expect(this.player2.executeCommand('/draw 3')).toBe(true);
            expect(this.player2.hand.length).toBe(4);
        });
    });

    describe('/forge', function () {
        it('to forge nothing if pass an invalid color', function () {
            expect(this.player1.getForgedKeys()).toBe(0);
            expect(this.player1.executeCommand('/forge purple')).toBe(false);
            expect(this.player1.getForgedKeys()).toBe(0);
        });

        it("to forge a key with opponent's authorization", function () {
            expect(this.player1.getForgedKeys()).toBe(0);
            expect(this.player1.executeCommand('/forge red')).toBe(true);
            expect(this.player1).toHavePrompt('Waiting for opponent to approve forging the key');
            expect(this.player2).toHavePrompt('player1 requests to forge the red key. Allow?');
            this.player2.clickPrompt('Yes');
            expect(this.player1.getForgedKeys()).toBe(1);
        });

        it("to not forge a key with opponent's deniel", function () {
            expect(this.player1.getForgedKeys()).toBe(0);
            expect(this.player1.executeCommand('/forge red')).toBe(true);
            this.player2.clickPrompt('No');
            expect(this.player1.getForgedKeys()).toBe(0);
        });

        it("player 2 to forge a key with opponent's authorization", function () {
            expect(this.player2.getForgedKeys()).toBe(0);
            expect(this.player2.executeCommand('/forge yellow')).toBe(true);
            expect(this.player2).toHavePrompt('Waiting for opponent to approve forging the key');
            expect(this.player1).toHavePrompt('player2 requests to forge the yellow key. Allow?');
            this.player1.clickPrompt('Yes');
            expect(this.player2.getForgedKeys()).toBe(1);
        });

        it('to not forge two keys', function () {
            expect(this.player1.getForgedKeys()).toBe(0);
            expect(this.player1.executeCommand('/forge red')).toBe(true);
            expect(this.player1).toHavePrompt('Waiting for opponent to approve forging the key');
            expect(this.player2).toHavePrompt('player1 requests to forge the red key. Allow?');
            this.player2.clickPrompt('Yes');
            expect(this.player1.executeCommand('/forge blue')).toBe(true);
            expect(this.player1).toHavePrompt('Waiting for opponent to approve forging the key');
            expect(this.player2).toHavePrompt('player1 requests to forge the blue key. Allow?');
            this.player2.clickPrompt('Yes');
            expect(this.player1.getForgedKeys()).toBe(2);
        });

        it('to not forge same key twice', function () {
            expect(this.player1.getForgedKeys()).toBe(0);
            expect(this.player1.executeCommand('/forge red')).toBe(true);
            expect(this.player1).toHavePrompt('Waiting for opponent to approve forging the key');
            expect(this.player2).toHavePrompt('player1 requests to forge the red key. Allow?');
            this.player2.clickPrompt('Yes');
            expect(this.player1.executeCommand('/forge red')).toBe(false);
            expect(this.player1.getForgedKeys()).toBe(1);
        });
    });

    describe('/token', function () {
        it('cannot set an invalid token', function () {
            expect(this.player1.executeCommand('/token invalid')).toBe(false);
        });

        it('set 1 (default) damage to a creature', function () {
            expect(this.player2.executeCommand('/token damage')).toBe(true);
            expect(this.player2).toBeAbleToSelect(this.batdrone);
            this.player2.clickCard(this.batdrone);
            expect(this.batdrone.damage).toBe(1);
        });

        it('set 5 power token to a creature', function () {
            this.niffleApe.tokens.power = 2;
            expect(this.player1.executeCommand('/token power 5')).toBe(true);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            this.player1.clickCard(this.niffleApe);
            expect(this.niffleApe.powerCounters).toBe(5);
        });
    });

    describe('/tide', function () {
        it('must accept 1 argument', function () {
            expect(this.player1.executeCommand('/tide')).toBe(false);
        });

        it('must not accept an invalid level', function () {
            expect(this.player1.executeCommand('/tide invalid')).toBe(false);
        });

        it('player 1 can change tide to low, high or neutral', function () {
            expect(this.player1.isTideHigh()).toBe(false);
            expect(this.player2.isTideHigh()).toBe(false);
            expect(this.player1.isTideLow()).toBe(false);
            expect(this.player2.isTideLow()).toBe(false);
            expect(this.player1.executeCommand('/tide low')).toBe(true);
            expect(this.player1.isTideLow()).toBe(true);
            expect(this.player2.isTideHigh()).toBe(true);
            expect(this.player1.executeCommand('/tide high')).toBe(true);
            expect(this.player1.isTideHigh()).toBe(true);
            expect(this.player2.isTideLow()).toBe(true);
            expect(this.player1.executeCommand('/tide neutral')).toBe(true);
            expect(this.player1.isTideHigh()).toBe(false);
            expect(this.player2.isTideHigh()).toBe(false);
            expect(this.player1.isTideLow()).toBe(false);
            expect(this.player2.isTideLow()).toBe(false);
        });

        it('player 2 can change tide to low, high or neutral', function () {
            expect(this.player1.isTideHigh()).toBe(false);
            expect(this.player2.isTideHigh()).toBe(false);
            expect(this.player1.isTideLow()).toBe(false);
            expect(this.player2.isTideLow()).toBe(false);
            expect(this.player2.executeCommand('/tide low')).toBe(true);
            expect(this.player1.isTideHigh()).toBe(true);
            expect(this.player2.isTideLow()).toBe(true);
            expect(this.player2.executeCommand('/tide high')).toBe(true);
            expect(this.player1.isTideLow()).toBe(true);
            expect(this.player2.isTideHigh()).toBe(true);
            expect(this.player1.executeCommand('/tide neutral')).toBe(true);
            expect(this.player1.isTideHigh()).toBe(false);
            expect(this.player2.isTideHigh()).toBe(false);
            expect(this.player1.isTideLow()).toBe(false);
            expect(this.player2.isTideLow()).toBe(false);
        });
    });

    describe('/token-creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    token: 'grunt',
                    inPlay: ['collector-worm', 'yxilx-dominator']
                },
                player2: {
                    token: 'researcher'
                }
            });

            this.game.manualMode = true;
        });

        it('should create a token creature from the top of the deck', function () {
            const topCard = this.player1.deck[0];
            expect(this.player1.executeCommand('/token-creature')).toBe(true);
            this.player1.clickPrompt('Left');
            expect(this.player1.inPlay.length).toBe(3);
            expect(this.player1.inPlay[0]).toBe(topCard);
            expect(topCard.isToken()).toBe(true);
            expect(topCard.name).toBe('Grunt');
        });

        it('should allow deploying the token creature between existing creatures', function () {
            const topCard = this.player1.deck[0];
            expect(this.player1.executeCommand('/token-creature')).toBe(true);
            expect(this.player1).toHavePromptButton('Left');
            expect(this.player1).toHavePromptButton('Deploy Left');
            expect(this.player1).toHavePromptButton('Deploy Right');
            expect(this.player1).toHavePromptButton('Right');
            this.player1.clickPrompt('Deploy Left');
            this.player1.clickCard(this.yxilxDominator);
            expect(this.player1.inPlay.length).toBe(3);
            expect(this.player1.inPlay[1]).toBe(topCard);
            expect(topCard.isToken()).toBe(true);
        });

        it('should not work outside of manual mode', function () {
            this.game.manualMode = false;
            expect(this.player1.executeCommand('/token-creature')).toBe(false);
            expect(this.player1.inPlay.length).toBe(2);
        });

        it('should fail if deck is empty', function () {
            while (this.player1.deck.length > 0) {
                this.player1.moveCard(this.player1.deck[0], 'discard');
            }
            expect(this.player1.executeCommand('/token-creature')).toBe(false);
            expect(this.player1.inPlay.length).toBe(2);
        });

        it("should allow player 2 to create a token creature during player 1's turn", function () {
            const topCard = this.player2.deck[0];
            expect(this.player2.executeCommand('/token-creature')).toBe(true);
            expect(this.player2.inPlay.length).toBe(1);
            expect(this.player2.inPlay[0]).toBe(topCard);
            expect(topCard.isToken()).toBe(true);
            expect(topCard.name).toBe('Researcher');
        });
    });

    describe('/token-creature without token card', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos'
                },
                player2: {}
            });

            this.game.manualMode = true;
        });

        it('should fail if player has no token card', function () {
            expect(this.player1.executeCommand('/token-creature')).toBe(false);
            expect(this.player1.inPlay.length).toBe(0);
        });
    });
});
