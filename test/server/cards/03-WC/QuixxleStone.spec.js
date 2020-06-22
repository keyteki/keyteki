describe('Quixxle Stone', function () {
    describe("Quixxle Stone's Persistent Effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['quixxle-stone'],
                    hand: ['shooler', 'malison', 'noname', 'rotgrub', 'hand-of-dis']
                },
                player2: {
                    house: 'shadows',
                    inPlay: [],
                    hand: ['bad-penny', 'umbra', 'chain-gang', 'explo-rover', 'securi-droid']
                }
            });
        });

        it('player has less creatures, can play multiple creatures', function () {
            this.player2.moveCard(this.badPenny, 'play area');
            this.player2.moveCard(this.umbra, 'play area');
            this.player1.play(this.shooler);
            this.player1.play(this.malison);
            this.player1.play(this.noname);
            this.player1.clickCard(this.rotgrub);
            expect(this.player1).toHavePrompt('Rotgrub');
            expect(this.player1).not.toHavePromptButton('Play this creature');
            expect(this.player1.inPlay.length).toBe(4);
            expect(this.player1.inPlay).toContain(this.quixxleStone);
            expect(this.player1.inPlay).toContain(this.shooler);
            expect(this.player1.inPlay).toContain(this.malison);
            expect(this.player1.inPlay).toContain(this.noname);
            expect(this.player1.inPlay).not.toContain(this.rotgrub);
        });

        it('equal amount of creatures in play, can play a creature', function () {
            this.player1.play(this.shooler);
            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.inPlay).toContain(this.quixxleStone);
            expect(this.player1.inPlay).toContain(this.shooler);
        });

        it('owner player has more creatures, cannot play a creature', function () {
            this.player1.play(this.malison);
            this.player1.clickCard(this.shooler);
            expect(this.player1).toHavePrompt('Shooler');
            expect(this.player1).not.toHavePromptButton('Play this creature');
            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.inPlay).toContain(this.quixxleStone);
            expect(this.player1.inPlay).toContain(this.malison);
        });

        it('owner player has more creatures, can play non-creature card', function () {
            this.player1.play(this.malison);
            this.player1.clickCard(this.handOfDis);
            expect(this.player1).toHavePrompt('Hand of Dis');
            expect(this.player1).not.toHavePromptButton('Play this creature');
            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.inPlay).toContain(this.quixxleStone);
            expect(this.player1.inPlay).toContain(this.malison);
        });

        it('non-owner player has more creatures, cannot play a creature', function () {
            this.player2.moveCard(this.badPenny, 'play area');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.clickCard(this.umbra);
            expect(this.player2).toHavePrompt('Umbra');
            expect(this.player2).not.toHavePromptButton('Play this creature');
            expect(this.player1.inPlay.length).toBe(1);
            expect(this.player1.inPlay).toContain(this.quixxleStone);
            expect(this.player2.inPlay.length).toBe(1);
            expect(this.player2.inPlay).toContain(this.badPenny);
            expect(this.player2.inPlay).not.toContain(this.umbra);
        });

        it('non-owner player has more creatures, but still can play one creature as an upgrade', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.play(this.exploRover);
            this.player2.clickCard(this.securiDroid);
            expect(this.player2).toHavePromptButton('Play this upgrade');
            expect(this.player2).not.toHavePromptButton('Play this creature');
            expect(this.player2).toHavePromptButton('Discard this card');
            this.player2.clickPrompt('Play this upgrade');
            this.player2.clickCard(this.exploRover);
            expect(this.exploRover.upgrades).toContain(this.securiDroid);
        });
    });
});
