describe('Duelist Training', function() {
    integration(function() {
        describe('Duelist Training', function() {
            beforeEach(function() {
                //this.spy = spyOn(this.game, 'reportError')
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['giver-of-gifts', 'shinjo-outrider'],
                        dynastyDiscard: ['giver-of-gifts'],
                        hand: ['duelist-training', 'duelist-training', 'charge']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['seppun-guardsman', 'adept-of-the-waves', 'shiba-peacemaker'],
                        hand: ['against-the-waves', 'against-the-waves', 'against-the-waves', 'let-go']
                    }
                });
                this.giverOfGifts1 = this.player1.findCardByName('giver-of-gifts', 'play area');
                this.giverOfGifts2 = this.player1.findCardByName('giver-of-gifts', 'dynasty discard pile');
                this.player1.placeCardInProvince(this.giverOfGifts2, 'province 1');
                this.seppunGuardsman = this.player2.findCardByName('seppun-guardsman');
                this.duelistTraining1 = this.player1.playAttachment('duelist-training', this.giverOfGifts1);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.giverOfGifts1],
                    defenders: ['seppun-guardsman', 'adept-of-the-waves', 'shiba-peacemaker']
                });
                this.player2.pass();
            });

            it('should initiate a duel', function() {
                this.player1.clickCard(this.giverOfGifts1);
                this.player1.clickPrompt('Initiate a duel to bow');
                expect(this.player1).toHavePrompt('Giver of Gifts');
                expect(this.player1).toBeAbleToSelect(this.seppunGuardsman);
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.player1).toHavePrompt('Honor Bid');
                expect(this.player2).toHavePrompt('Honor Bid');
            });

            it('should offer players a choice of how to pay the difference in bids', function() {
                this.player1.clickCard(this.giverOfGifts1);
                this.player1.clickPrompt('Initiate a duel to bow');
                this.player1.clickCard(this.seppunGuardsman);
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Duelist Training');
                this.player1.clickPrompt('Pay with honor');
                expect(this.player1.honor).toBe(10);
            });

            it('should allow players to pay with cards when they have sufficient to do so', function() {
                this.player1.clickCard(this.giverOfGifts1);
                this.player1.clickPrompt('Initiate a duel to bow');
                this.player1.clickCard(this.seppunGuardsman);
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Duelist Training');
                this.player1.clickPrompt('Pay with cards');
                expect(this.player1).toHavePrompt('Giver of Gifts');
                this.player1.clickCard('charge');
                expect(this.seppunGuardsman.bowed).toBe(true);
            });

            it('should not offer players the choice if they don\'t have sufficent cards', function() {
                this.player1.clickCard(this.giverOfGifts1);
                this.player1.clickPrompt('Initiate a duel to bow');
                this.player1.clickCard(this.seppunGuardsman);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.player1.honor).toBe(7);
                expect(this.seppunGuardsman.bowed).toBe(true);
            });

            it('should be removed if the attachment is removed from the character', function() {
                this.player1.clickCard(this.giverOfGifts1);
                this.player1.clickPrompt('Move an attachment');
                this.player1.clickCard(this.duelistTraining1);
                this.shinjoOutrider = this.player1.clickCard('shinjo-outrider');
                expect(this.giverOfGifts1.attachments.toArray()).not.toContain(this.duelistTraining1);
                expect(this.shinjoOutrider.attachments.toArray()).toContain(this.duelistTraining1);
                this.player2.pass();
                this.player1.clickCard(this.giverOfGifts1);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should be usable by another character, even if it has been used by this one', function() {
                this.player1.clickCard(this.giverOfGifts1);
                this.player1.clickPrompt('Initiate a duel to bow');
                this.player1.clickCard(this.seppunGuardsman);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player2.pass();
                this.player1.clickCard(this.giverOfGifts1);
                expect(this.player1).toHavePrompt('Choose an attachment');
                this.player1.clickCard(this.duelistTraining1);
                this.shinjoOutrider = this.player1.clickCard('shinjo-outrider');
                this.player2.pass();
                this.player1.clickCard(this.shinjoOutrider);
                expect(this.shinjoOutrider.inConflict).toBe(true);
                this.player2.pass();
                this.player1.clickCard(this.shinjoOutrider);
                expect(this.player1).toHavePrompt('Shinjo Outrider');
            });

            it('should not be usable if it is used and moved and then moved back', function() {
                // Initiate a duel with GoG1
                this.player1.clickCard(this.giverOfGifts1);
                this.player1.clickPrompt('Initiate a duel to bow');
                this.player1.clickCard(this.seppunGuardsman);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player2.pass();
                // Bring GoG2 into conflict
                this.player1.clickCard('charge');
                this.player1.clickCard(this.giverOfGifts2);
                expect(this.giverOfGifts2.location).toBe('play area');
                expect(this.giverOfGifts2.inConflict).toBe(true);
                this.player2.pass();
                // Move DT to GoG2
                this.player1.clickCard(this.giverOfGifts1);
                expect(this.player1).toHavePrompt('Choose an attachment');
                this.player1.clickCard(this.duelistTraining1);
                this.player1.clickCard(this.giverOfGifts2);
                expect(this.giverOfGifts1.attachments.toArray()).not.toContain(this.duelistTraining1);
                expect(this.giverOfGifts2.attachments.toArray()).toContain(this.duelistTraining1);
                this.player2.pass();
                // Initiate a duel with GoG2
                this.player1.clickCard(this.giverOfGifts2);
                expect(this.player1).toHavePrompt('Choose an ability:');
                this.player1.clickPrompt('Initiate a duel to bow');
                this.player1.clickCard(this.seppunGuardsman);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player2.pass();
                // Move DT back to GoG1
                this.player1.clickCard(this.giverOfGifts2);
                expect(this.player1).toHavePrompt('Choose an attachment');
                this.player1.clickCard(this.duelistTraining1);
                this.player1.clickCard(this.giverOfGifts1);
                expect(this.giverOfGifts2.attachments.toArray()).not.toContain(this.duelistTraining1);
                expect(this.giverOfGifts1.attachments.toArray()).toContain(this.duelistTraining1);
                this.player2.pass();
                // Try to trigger DT again
                this.player1.clickCard(this.giverOfGifts1);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('a second copy of DT should allow the ability to be used twice', function() {
                this.player1.clickCard(this.giverOfGifts1);
                this.player1.clickPrompt('Initiate a duel to bow');
                this.player1.clickCard(this.seppunGuardsman);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player2.pass();
                this.duelistTraining2 = this.player1.findCardByName('duelist-training', 'hand');
                this.player1.playAttachment(this.duelistTraining2, this.giverOfGifts1);
                this.player2.pass();
                this.player1.clickCard(this.giverOfGifts1);
                expect(this.player1).toHavePrompt('Choose an ability:');
                this.player1.clickPrompt('Initiate a duel to bow');
                expect(this.player1).toHavePrompt('Giver of Gifts');
                expect(this.player1).toBeAbleToSelect(this.seppunGuardsman);                
            });

            it('should reset the limit of the abilitiy if DT leaves play', function() {
                this.player1.clickCard(this.giverOfGifts1);
                this.player1.clickPrompt('Initiate a duel to bow');
                this.player1.clickCard(this.seppunGuardsman);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player2.clickCard('let-go');
                this.player2.clickCard(this.duelistTraining1);
                expect(this.duelistTraining1.location).toBe('conflict discard pile');
                this.player1.moveCard(this.duelistTraining1, 'hand');
                this.player1.playAttachment(this.duelistTraining1, this.giverOfGifts1);
                this.player2.pass();
                expect(this.duelistTraining1.location).toBe('play area');
                expect(this.giverOfGifts1.attachments.toArray()).toContain(this.duelistTraining1);
                this.player1.clickCard(this.giverOfGifts1);
                expect(this.player1).toHavePrompt('Choose an ability:');
            });
        });
    });
});
