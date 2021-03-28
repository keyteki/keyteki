describe('Manchego', function () {
    describe("Manchego's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: [
                        'manchego',
                        'mother',
                        'batdrone',
                        'wild-wormhole',
                        'hexpion',
                        'dextre',
                        'titan-mechanic',
                        'doc-bookton'
                    ]
                },
                player2: {
                    amber: 5,
                    inPlay: ['krump']
                }
            });

            for (let card of this.player1.player.deck) {
                this.player1.moveCard(card, 'discard');
            }
        });

        it('should steal 2A if there are 5 or fewer cards in the deck [0]', function () {
            expect(this.player1.deck.length).toBe(0);
            this.player1.play(this.manchego);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });

        it('should steal 2A if there are 5 or fewer cards in the deck [1]', function () {
            this.player1.moveCard(this.mother, 'deck');
            expect(this.player1.deck.length).toBe(1);
            this.player1.play(this.manchego);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });

        it('should steal 2A if there are 5 or fewer cards in the deck [2]', function () {
            this.player1.moveCard(this.mother, 'deck');
            this.player1.moveCard(this.batdrone, 'deck');
            this.player1.play(this.manchego);
            expect(this.player1.deck.length).toBe(2);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });

        it('should steal 2A if there are 5 or fewer cards in the deck [3]', function () {
            this.player1.moveCard(this.mother, 'deck');
            this.player1.moveCard(this.batdrone, 'deck');
            this.player1.moveCard(this.wildWormhole, 'deck');
            this.player1.play(this.manchego);
            expect(this.player1.deck.length).toBe(3);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });

        it('should steal 2A if there are 5 or fewer cards in the deck [4]', function () {
            this.player1.moveCard(this.mother, 'deck');
            this.player1.moveCard(this.batdrone, 'deck');
            this.player1.moveCard(this.wildWormhole, 'deck');
            this.player1.moveCard(this.hexpion, 'deck');
            this.player1.play(this.manchego);
            expect(this.player1.deck.length).toBe(4);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });

        it('should steal 2A if there are 5 or fewer cards in the deck [5]', function () {
            this.player1.moveCard(this.mother, 'deck');
            this.player1.moveCard(this.batdrone, 'deck');
            this.player1.moveCard(this.wildWormhole, 'deck');
            this.player1.moveCard(this.hexpion, 'deck');
            this.player1.moveCard(this.dextre, 'deck');
            this.player1.play(this.manchego);
            expect(this.player1.deck.length).toBe(5);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });

        it('should NOT steal 2A if there are 6 or more cards in the deck [6]', function () {
            this.player1.moveCard(this.mother, 'deck');
            this.player1.moveCard(this.batdrone, 'deck');
            this.player1.moveCard(this.wildWormhole, 'deck');
            this.player1.moveCard(this.hexpion, 'deck');
            this.player1.moveCard(this.dextre, 'deck');
            this.player1.moveCard(this.titanMechanic, 'deck');
            this.player1.play(this.manchego);
            expect(this.player1.deck.length).toBe(6);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
        });

        it('should NOT steal 2A if there are 6 or more cards in the deck [7]', function () {
            this.player1.moveCard(this.mother, 'deck');
            this.player1.moveCard(this.batdrone, 'deck');
            this.player1.moveCard(this.wildWormhole, 'deck');
            this.player1.moveCard(this.hexpion, 'deck');
            this.player1.moveCard(this.dextre, 'deck');
            this.player1.moveCard(this.titanMechanic, 'deck');
            this.player1.moveCard(this.docBookton, 'deck');
            this.player1.play(this.manchego);
            expect(this.player1.deck.length).toBe(7);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
        });
    });

    describe("Manchego's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['manchego'],
                    hand: [
                        'mother',
                        'batdrone',
                        'wild-wormhole',
                        'hexpion',
                        'dextre',
                        'titan-mechanic',
                        'doc-bookton'
                    ]
                },
                player2: {
                    amber: 5,
                    inPlay: ['krump', 'nexus']
                }
            });
        });

        it('should prompt to put manchego back in the deck when fighting and do it when you click the card', function () {
            this.player1.fightWith(this.manchego, this.nexus);
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toBeAbleToSelect(this.manchego);
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.manchego);
            expect(this.manchego.location).toBe('deck');
        });

        it('should prompt to put manchego back in the deck when fighting and not do it when you click done', function () {
            this.player1.fightWith(this.manchego, this.nexus);
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toBeAbleToSelect(this.manchego);
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.manchego.location).toBe('play area');
        });

        it('should prompt to put manchego back in the deck when reaping and do it when you click the card', function () {
            this.player1.reap(this.manchego);
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toBeAbleToSelect(this.manchego);
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.manchego);
            expect(this.manchego.location).toBe('deck');
        });

        it('should prompt to put manchego back in the deck when reaping and not do it when you click done', function () {
            this.player1.reap(this.manchego);
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toBeAbleToSelect(this.manchego);
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.manchego.location).toBe('play area');
        });
    });
});
