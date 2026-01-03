describe('Replay Pod', function () {
    describe("Replay Pod's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['ammonia-clouds', 'ether-spider', 'jammer-pack'],
                    inPlay: ['replay-pod', 'yxilo-bolter', 'john-smyth', 'blypyp', 'pelf'],
                    discard: ['replay-pod']
                },
                player2: {
                    amber: 1,
                    hand: ['rant-and-rive', 'punch'],
                    inPlay: ['yxili-marauder', 'earthshaker']
                }
            });

            this.replayPod2 = this.player1.player.discard[0];
        });

        it('should give all friendly mars creatures a destroyed ability', function () {
            this.player1.play(this.ammoniaClouds);
            this.player1.clickCard(this.yxiloBolter);
            this.player1.clickCard(this.johnSmyth);
            expect(this.replayPod.childCards).toContain(this.yxiloBolter);
            expect(this.replayPod.childCards).toContain(this.johnSmyth);
            expect(this.replayPod.childCards).toContain(this.blypyp);
            expect(this.pelf.location).toBe('discard');
            expect(this.yxiliMarauder.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should cause upgrades to fall off', function () {
            this.player1.playUpgrade(this.jammerPack, this.johnSmyth);
            this.player1.play(this.ammoniaClouds);
            this.player1.clickCard(this.yxiloBolter);
            this.player1.clickCard(this.johnSmyth);
            expect(this.jammerPack.location).toBe('discard');
            expect(this.jammerPack.parent).toBe(null);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should return cards to hand and purge itself', function () {
            this.player1.play(this.ammoniaClouds);
            this.player1.clickCard(this.yxiloBolter);
            this.player1.clickCard(this.johnSmyth);
            this.player1.useAction(this.replayPod);
            expect(this.yxiloBolter.location).toBe('hand');
            expect(this.johnSmyth.location).toBe('hand');
            expect(this.blypyp.location).toBe('hand');
            expect(this.pelf.location).toBe('discard');
            expect(this.yxiliMarauder.location).toBe('discard');
            expect(this.replayPod.location).toBe('purged');
        });

        it('should return amber on ether spider to opponent', function () {
            this.player1.play(this.etherSpider);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.rantAndRive);
            expect(this.player2.amber).toBe(1);
            expect(this.etherSpider.tokens.amber).toBe(1);
            this.player2.fightWith(this.earthshaker, this.etherSpider);
            expect(this.replayPod.childCards).toContain(this.etherSpider);
            expect(this.player2.amber).toBe(2);
            expect(this.etherSpider.tokens.amber).toBe(undefined);
        });

        it('should let user choose which replay pod to use', function () {
            this.player1.moveCard(this.replayPod2, 'hand');
            this.player1.play(this.replayPod2);
            this.player1.play(this.ammoniaClouds);
            this.player1.clickCard(this.yxiloBolter);
            this.player1.clickPrompt(this.replayPod.name);
            this.player1.clickCard(this.johnSmyth);
            this.player1.clickPrompt(this.replayPod.name, 1);
            this.player1.clickPrompt(this.replayPod.name);
            expect(this.replayPod.childCards).toContain(this.yxiloBolter);
            expect(this.replayPod2.childCards).toContain(this.johnSmyth);
            expect(this.replayPod.childCards).toContain(this.blypyp);
            expect(this.pelf.location).toBe('discard');
            expect(this.yxiliMarauder.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow opponent to choose which replay pod to use', function () {
            this.player1.moveCard(this.replayPod2, 'hand');
            this.player1.play(this.replayPod2);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.punch);
            this.player2.clickCard(this.yxiloBolter);
            this.player2.clickPrompt(this.replayPod.name, 1);
            expect(this.replayPod2.childCards).toContain(this.yxiloBolter);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
