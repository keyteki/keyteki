describe('Mobius Scroll', function () {
    describe("Mobius Scroll's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['mobius-scroll'],
                    hand: ['batdrone', 'doc-bookton']
                },
                player2: {
                    inPlay: []
                }
            });
        });

        it('should prompt to choose two cards from hand, and should allow choosing 0', function () {
            this.player1.clickCard(this.mobiusScroll);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Mobius Scroll');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.mobiusScroll.location).toBe('archives');
        });

        it('should archive the cards', function () {
            this.player1.clickCard(this.mobiusScroll);
            this.player1.clickPrompt("Use this card's Action ability");
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.docBookton);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.mobiusScroll.location).toBe('archives');
            expect(this.batdrone.location).toBe('archives');
            expect(this.docBookton.location).toBe('archives');
        });
    });

    describe("Mobius Scroll's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['nexus'],
                    hand: ['batdrone', 'doc-bookton', 'remote-access']
                },
                player2: {
                    inPlay: ['mobius-scroll'],
                    hand: ['dextre', 'mother']
                }
            });
        });

        it("should archive 2 cards for the using player and it should always go in the owner's archives", function () {
            this.player1.play(this.remoteAccess);
            this.player1.clickCard(this.mobiusScroll);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.docBookton);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.mobiusScroll.location).toBe('archives');
            expect(this.batdrone.location).toBe('archives');
            expect(this.docBookton.location).toBe('archives');
            expect(this.player1.archives).toContain(this.batdrone);
            expect(this.player1.archives).toContain(this.docBookton);
            expect(this.player2.archives).toContain(this.mobiusScroll);
        });
    });

    describe("Mobius Scroll's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['nexus'],
                    hand: ['batdrone', 'doc-bookton', 'remote-access']
                },
                player2: {
                    inPlay: ['mobius-scroll'],
                    hand: ['dextre', 'mother']
                }
            });
        });

        it("should archive 2 cards for the using player and it should always go in the owner's archives", function () {
            this.player1.reap(this.nexus);
            this.player1.clickCard(this.mobiusScroll);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.docBookton);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.mobiusScroll.location).toBe('archives');
            expect(this.batdrone.location).toBe('archives');
            expect(this.docBookton.location).toBe('archives');
            expect(this.player1.archives).toContain(this.batdrone);
            expect(this.player1.archives).toContain(this.docBookton);
            expect(this.player2.archives).toContain(this.mobiusScroll);
        });
    });
});
