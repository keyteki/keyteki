describe('Curse Of Obstinancy', function () {
    describe("Curse Of Obstinancy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['curse-of-obstinacy'],
                    inPlay: ['subject-kirby', 'commander-chan', 'medic-ingram']
                },
                player2: {
                    hand: ['hunting-witch', 'flaxia'],
                    inPlay: ['dust-pixie', 'timetraveller']
                }
            });
            this.player1.play(this.curseOfObstinacy);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
        });

        it('should enter play under opponents control', function () {
            expect(this.curseOfObstinacy.location).toBe('play area');
            expect(this.player1.player.cardsInPlay).not.toContain(this.curseOfObstinacy);
            expect(this.player2.player.cardsInPlay).toContain(this.curseOfObstinacy);
        });

        it('should do nothing if there are only flank creatures', function () {
            this.player2.endTurn();
            expect(this.dustPixie.stunned).toBe(false);
            expect(this.timetraveller.stunned).toBe(false);
            expect(this.subjectKirby.stunned).toBe(false);
            expect(this.commanderChan.stunned).toBe(false);
            expect(this.medicIngram.stunned).toBe(false);
        });

        it('should do nothing if no one shares a house with a neighbor', function () {
            this.player2.playCreature(this.flaxia);
            this.player2.endTurn();
            expect(this.dustPixie.stunned).toBe(false);
            expect(this.timetraveller.stunned).toBe(false);
            expect(this.flaxia.stunned).toBe(false);
            expect(this.subjectKirby.stunned).toBe(false);
            expect(this.commanderChan.stunned).toBe(false);
            expect(this.medicIngram.stunned).toBe(false);
        });

        it('should stun non-flank creatures that share a house with a neighbor', function () {
            this.player2.playCreature(this.flaxia, true);
            this.player2.playCreature(this.huntingWitch, true);
            this.player2.endTurn();
            expect(this.huntingWitch.stunned).toBe(false);
            expect(this.flaxia.stunned).toBe(true);
            expect(this.dustPixie.stunned).toBe(true);
            expect(this.timetraveller.stunned).toBe(false);
            expect(this.subjectKirby.stunned).toBe(false);
            expect(this.commanderChan.stunned).toBe(false);
            expect(this.medicIngram.stunned).toBe(false);
        });
    });
});
