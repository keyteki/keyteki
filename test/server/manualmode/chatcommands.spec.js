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
            this.player1.clickPrompt('Yes');
            expect(this.player2.getForgedKeys()).toBe(1);
        });

        it('to not forge two keys', function () {
            expect(this.player1.getForgedKeys()).toBe(0);
            expect(this.player1.executeCommand('/forge red')).toBe(true);
            this.player2.clickPrompt('Yes');
            expect(this.player1.executeCommand('/forge blue')).toBe(true);
            this.player2.clickPrompt('Yes');
            expect(this.player1.getForgedKeys()).toBe(2);
        });

        it('to not forge same key twice', function () {
            expect(this.player1.getForgedKeys()).toBe(0);
            expect(this.player1.executeCommand('/forge red')).toBe(true);
            this.player2.clickPrompt('Yes');
            expect(this.player1.executeCommand('/forge red')).toBe(false);
            expect(this.player1.getForgedKeys()).toBe(1);
        });
    });
});
