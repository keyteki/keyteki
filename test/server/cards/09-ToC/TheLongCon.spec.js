describe('The Long Con', function () {
    describe("The Long Con's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    token: 'stooge',
                    inPlay: new Array(5).fill('stooge:toad').concat(['umbra', 'the-long-con'])
                },
                player2: {
                    token: 'prospector',
                    hand: ['sneklifter', 'hypnobeam'],
                    inPlay: ['dust-pixie']
                }
            });

            this.stooge1 = this.player1.player.creaturesInPlay[0];
            this.stooge2 = this.player1.player.creaturesInPlay[1];
            this.stooge3 = this.player1.player.creaturesInPlay[2];
            this.stooge4 = this.player1.player.creaturesInPlay[3];
            this.stooge5 = this.player1.player.creaturesInPlay[4];
            this.stooge6 = this.player1.player.deck[0];
            this.hypnobeam.printedHouse = 'shadows';
            this.hypnobeam.maverick = 'shadows';
        });

        it('should prevent friendly Stooges from reaping', function () {
            this.player1.clickCard(this.stooge1);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Cancel');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.stooge1);
            this.player2.clickPrompt('Right');
            this.player2.reap(this.stooge1);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make a Stooge on action', function () {
            this.player1.useAction(this.theLongCon);
            this.player1.clickPrompt('Right');
            expect(this.stooge6.location).toBe('play area');
        });

        it('should be able to destroy 0 Stooges', function () {
            this.player1.useAction(this.theLongCon);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to destroy 6 Stooges and forge', function () {
            this.player1.useAction(this.theLongCon);
            this.player1.clickPrompt('Right');
            expect(this.player1).toBeAbleToSelect(this.stooge1);
            expect(this.player1).toBeAbleToSelect(this.stooge2);
            expect(this.player1).toBeAbleToSelect(this.stooge3);
            expect(this.player1).toBeAbleToSelect(this.stooge4);
            expect(this.player1).toBeAbleToSelect(this.stooge5);
            expect(this.player1).toBeAbleToSelect(this.stooge6);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.stooge1);
            this.player1.clickCard(this.stooge2);
            this.player1.clickCard(this.stooge3);
            this.player1.clickCard(this.stooge4);
            this.player1.clickCard(this.stooge5);
            this.player1.clickCard(this.stooge6);
            this.player1.clickPrompt('Done');
            expect(this.stooge1.location).toBe('discard');
            expect(this.stooge2.location).toBe('discard');
            expect(this.stooge3.location).toBe('discard');
            expect(this.stooge4.location).toBe('discard');
            expect(this.stooge5.location).toBe('discard');
            expect(this.stooge6.location).toBe('discard');
            expect(this.dustPixie.location).toBe('play area');
            this.player1.forgeKey('blue');
            expect(this.player1.amber).toBe(1);
            expect(this.theLongCon.location).toBe('purged');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not allow non-Stooge player to make token', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.stooge1);
            this.player2.clickPrompt('Right');
            this.player2.playCreature(this.sneklifter);
            this.player2.clickCard(this.theLongCon);
            this.player2.clickCard(this.stooge1);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            this.player2.clickPrompt('Cancel');
            this.player2.useAction(this.theLongCon);
            this.player2.clickCard(this.stooge1);
            this.player2.clickPrompt('Done');
            expect(this.stooge1.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
