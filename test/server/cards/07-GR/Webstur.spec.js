describe('Webstur', function () {
    describe("Webstur's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['webstur'],
                    discard: ['flaxia', 'full-moon', 'hunting-witch']
                },
                player2: {
                    inPlay: ['dust-pixie', 'crogg-the-clumsy', 'dew-faerie'],
                    discard: ['ballcano', 'groke', 'glimmer']
                }
            });
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.fullMoon, 'deck');
            this.player1.moveCard(this.huntingWitch, 'deck');
            this.player1.moveCard(this.ballcano, 'deck');
            this.player1.moveCard(this.groke, 'deck');
            this.player1.moveCard(this.glimmer, 'deck');
        });

        it('allows player to do nothing', function () {
            this.player1.fightWith(this.webstur, this.dustPixie);
            this.player1.clickPrompt('No');
            expect(this.huntingWitch.location).toBe('deck');
            expect(this.fullMoon.location).toBe('deck');
            expect(this.flaxia.location).toBe('deck');
            expect(this.glimmer.location).toBe('deck');
            expect(this.groke.location).toBe('deck');
            expect(this.ballcano.location).toBe('deck');
            expect(this.player1.player.discard.length).toBe(0);
            expect(this.player2.player.discard.length).toBe(1);
            expect(this.webstur.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('allows player to discard the top card of each deck when it has one damage', function () {
            this.player1.fightWith(this.webstur, this.dustPixie);
            this.player1.clickPrompt('Yes');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.fullMoon.location).toBe('deck');
            expect(this.flaxia.location).toBe('deck');
            expect(this.glimmer.location).toBe('discard');
            expect(this.groke.location).toBe('deck');
            expect(this.ballcano.location).toBe('deck');
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player2.player.discard.length).toBe(2);
            expect(this.webstur.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('resets between uses', function () {
            this.player1.fightWith(this.webstur, this.dustPixie);
            this.player1.clickPrompt('Yes');
            this.webstur.ready();
            this.player1.fightWith(this.webstur, this.dewFaerie);
            this.player1.clickPrompt('Yes');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.fullMoon.location).toBe('discard');
            expect(this.flaxia.location).toBe('deck');
            expect(this.glimmer.location).toBe('discard');
            expect(this.groke.location).toBe('discard');
            expect(this.ballcano.location).toBe('deck');
            expect(this.player1.player.discard.length).toBe(2);
            expect(this.player2.player.discard.length).toBe(3);
            expect(this.webstur.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('allows player to sometimes discard the top card of each deck when it has multiple damage', function () {
            this.player1.fightWith(this.webstur, this.croggTheClumsy);
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('No');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.fullMoon.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.glimmer.location).toBe('discard');
            expect(this.groke.location).toBe('discard');
            expect(this.ballcano.location).toBe('discard');
            expect(this.player1.player.discard.length).toBe(3);
            expect(this.player2.player.discard.length).toBe(4);
            expect(this.webstur.damage).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });

        it('works if only one player has a deck', function () {
            this.player1.player.deck = [];
            this.player1.fightWith(this.webstur, this.croggTheClumsy);
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('No');
            expect(this.glimmer.location).toBe('discard');
            expect(this.groke.location).toBe('discard');
            expect(this.ballcano.location).toBe('discard');
            expect(this.player1.player.discard.length).toBe(0);
            expect(this.player2.player.discard.length).toBe(4);
            expect(this.webstur.damage).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing with no damage', function () {
            this.player1.fightWith(this.webstur, this.dewFaerie);
            expect(this.huntingWitch.location).toBe('deck');
            expect(this.fullMoon.location).toBe('deck');
            expect(this.flaxia.location).toBe('deck');
            expect(this.glimmer.location).toBe('deck');
            expect(this.groke.location).toBe('deck');
            expect(this.ballcano.location).toBe('deck');
            expect(this.player1.player.discard.length).toBe(0);
            expect(this.player2.player.discard.length).toBe(0);
            expect(this.webstur.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
