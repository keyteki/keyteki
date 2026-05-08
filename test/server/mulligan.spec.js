const DeckBuilder = require('../helpers/deckbuilder.js');

describe('Mulligan', function () {
    beforeEach(function () {
        const deckBuilder = new DeckBuilder();
        this.player1.selectDeck(
            deckBuilder.customDeck({
                hand: ['troll', 'anger', 'punch', 'bumpsy', 'headhunter', 'smith', 'earthshaker']
            })
        );
        this.player2.selectDeck(
            deckBuilder.customDeck({
                hand: [
                    'dust-pixie',
                    'hunting-witch',
                    'flaxia',
                    'silvertooth',
                    'urchin',
                    'bad-penny'
                ]
            })
        );
        this.startGame();
    });

    describe('when both players keep their hands', function () {
        it('should log player1 decision immediately', function () {
            this.player1.clickPrompt('Keep Hand');
            const logsAfterP1 = this.getChatLogs(20);
            expect(
                logsAfterP1.some((log) => log.includes('player1 keeps their starting hand'))
            ).toBe(true);
            expect(logsAfterP1.some((log) => log.includes('player2 keeps'))).toBe(false);
            expect(logsAfterP1.some((log) => log.includes('player2 mulligans'))).toBe(false);

            this.player2.clickPrompt('Keep Hand');
            const logsAfterP2 = this.getChatLogs(20);
            expect(
                logsAfterP2.some((log) => log.includes('player2 keeps their starting hand'))
            ).toBe(true);
        });

        it('should keep full hand size', function () {
            this.player1.clickPrompt('Keep Hand');
            this.player2.clickPrompt('Keep Hand');
            expect(this.player1.hand.length).toBe(7);
            expect(this.player2.hand.length).toBe(6);
        });
    });

    describe('when both players keep and player2 decides first', function () {
        it('should not log player2 decision until player1 decides', function () {
            this.player2.clickPrompt('Keep Hand');
            const logsAfterP2 = this.getChatLogs(20);
            expect(logsAfterP2.some((log) => log.includes('player2 keeps'))).toBe(false);
            expect(logsAfterP2.some((log) => log.includes('player2 mulligans'))).toBe(false);

            this.player1.clickPrompt('Keep Hand');
            const logsAfterP1 = this.getChatLogs(20);
            const p1Index = logsAfterP1.findIndex((log) => log.includes('player1 keeps'));
            const p2Index = logsAfterP1.findIndex((log) => log.includes('player2 keeps'));
            expect(p1Index).not.toBe(-1);
            expect(p2Index).not.toBe(-1);
            expect(p1Index).toBe(p2Index - 1);
        });
    });

    describe('when player1 mulligans', function () {
        it('should log player1 decision immediately', function () {
            this.player1.clickPrompt('Mulligan');
            const logsAfterP1 = this.getChatLogs(20);
            expect(
                logsAfterP1.some((log) => log.includes('player1 mulligans their starting hand'))
            ).toBe(true);
            expect(logsAfterP1.some((log) => log.includes('player2 keeps'))).toBe(false);
            expect(logsAfterP1.some((log) => log.includes('player2 mulligans'))).toBe(false);

            this.player2.clickPrompt('Keep Hand');
            const logsAfterP2 = this.getChatLogs(20);
            expect(
                logsAfterP2.some((log) => log.includes('player2 keeps their starting hand'))
            ).toBe(true);
        });

        it('should reduce player1 hand size by 1', function () {
            this.player1.clickPrompt('Mulligan');
            this.player2.clickPrompt('Keep Hand');
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(6);
        });
    });

    describe('when player1 mulligans and player2 decides first', function () {
        it('should not log player2 decision until player1 decides', function () {
            this.player2.clickPrompt('Keep Hand');
            const logsAfterP2 = this.getChatLogs(20);
            expect(logsAfterP2.some((log) => log.includes('player2 keeps'))).toBe(false);
            expect(logsAfterP2.some((log) => log.includes('player2 mulligans'))).toBe(false);

            this.player1.clickPrompt('Mulligan');
            const logsAfterP1 = this.getChatLogs(20);
            const p1Index = logsAfterP1.findIndex((log) => log.includes('player1 mulligans'));
            const p2Index = logsAfterP1.findIndex((log) => log.includes('player2 keeps'));
            expect(p1Index).not.toBe(-1);
            expect(p2Index).not.toBe(-1);
            expect(p1Index).toBe(p2Index - 1);
        });
    });

    describe('when player2 mulligans', function () {
        it('should log player1 decision immediately', function () {
            this.player1.clickPrompt('Keep Hand');
            const logsAfterP1 = this.getChatLogs(20);
            expect(
                logsAfterP1.some((log) => log.includes('player1 keeps their starting hand'))
            ).toBe(true);
            expect(logsAfterP1.some((log) => log.includes('player2 keeps'))).toBe(false);
            expect(logsAfterP1.some((log) => log.includes('player2 mulligans'))).toBe(false);

            this.player2.clickPrompt('Mulligan');
            const logsAfterP2 = this.getChatLogs(20);
            expect(
                logsAfterP2.some((log) => log.includes('player2 mulligans their starting hand'))
            ).toBe(true);
        });

        it('should reduce player2 hand size by 1', function () {
            this.player1.clickPrompt('Keep Hand');
            this.player2.clickPrompt('Mulligan');
            expect(this.player1.hand.length).toBe(7);
            expect(this.player2.hand.length).toBe(5);
        });
    });

    describe('when player2 mulligans and decides first', function () {
        it('should not log player2 decision until player1 decides', function () {
            this.player2.clickPrompt('Mulligan');
            const logsAfterP2 = this.getChatLogs(20);
            expect(logsAfterP2.some((log) => log.includes('player2 keeps'))).toBe(false);
            expect(logsAfterP2.some((log) => log.includes('player2 mulligans'))).toBe(false);

            this.player1.clickPrompt('Keep Hand');
            const logsAfterP1 = this.getChatLogs(20);
            const p1Index = logsAfterP1.findIndex((log) => log.includes('player1 keeps'));
            const p2Index = logsAfterP1.findIndex((log) => log.includes('player2 mulligans'));
            expect(p1Index).not.toBe(-1);
            expect(p2Index).not.toBe(-1);
            expect(p1Index).toBe(p2Index - 1);
        });
    });

    describe('when both players mulligan', function () {
        it('should log player1 decision immediately', function () {
            this.player1.clickPrompt('Mulligan');
            const logsAfterP1 = this.getChatLogs(20);
            expect(
                logsAfterP1.some((log) => log.includes('player1 mulligans their starting hand'))
            ).toBe(true);
            expect(logsAfterP1.some((log) => log.includes('player2 keeps'))).toBe(false);
            expect(logsAfterP1.some((log) => log.includes('player2 mulligans'))).toBe(false);

            this.player2.clickPrompt('Mulligan');
            const logsAfterP2 = this.getChatLogs(20);
            expect(
                logsAfterP2.some((log) => log.includes('player2 mulligans their starting hand'))
            ).toBe(true);
        });

        it('should reduce both hand sizes by 1', function () {
            this.player1.clickPrompt('Mulligan');
            this.player2.clickPrompt('Mulligan');
            expect(this.player1.hand.length).toBe(6);
            expect(this.player2.hand.length).toBe(5);
        });
    });

    describe('when both players mulligan and player2 decides first', function () {
        it('should not log player2 decision until player1 decides', function () {
            this.player2.clickPrompt('Mulligan');
            const logsAfterP2 = this.getChatLogs(20);
            expect(logsAfterP2.some((log) => log.includes('player2 keeps'))).toBe(false);
            expect(logsAfterP2.some((log) => log.includes('player2 mulligans'))).toBe(false);

            this.player1.clickPrompt('Mulligan');
            const logsAfterP1 = this.getChatLogs(20);
            const p1Index = logsAfterP1.findIndex((log) => log.includes('player1 mulligans'));
            const p2Index = logsAfterP1.findIndex((log) => log.includes('player2 mulligans'));
            expect(p1Index).not.toBe(-1);
            expect(p2Index).not.toBe(-1);
            expect(p1Index).toBe(p2Index - 1);
        });
    });
});
