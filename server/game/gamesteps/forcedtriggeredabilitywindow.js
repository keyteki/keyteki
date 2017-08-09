const _ = require('underscore');
const uuid = require('uuid');

const BaseAbilityWindow = require('./baseabilitywindow.js');
const TriggeredAbilityWindowTitles = require('./triggeredabilitywindowtitles.js');

class ForcedTriggeredAbilityWindow extends BaseAbilityWindow {
    registerAbility(ability, event) {
        let context = ability.createContext(event);
        let player = ability.card.controller;
        this.abilityChoices.push({
            id: uuid.v1(),
            player: player,
            ability: ability,
            card: ability.card,
            context: context
        });
    }

    continue() {
        this.abilityChoices = _.filter(this.abilityChoices, abilityChoice => abilityChoice.ability.meetsRequirements(abilityChoice.context));

        if(this.abilityChoices.length > 1) {
            this.promptPlayer();
            return false;
        }

        _.each(this.abilityChoices, abilityChoice => {
            this.game.resolveAbility(abilityChoice.ability, abilityChoice.context);
        });

        return true;
    }

    promptPlayer() {
        let buttons = _.chain(this.abilityChoices)
            .map(abilityChoice => {
                let title = abilityChoice.player.name + ' - ' + abilityChoice.card.name;
                return { text: title, method: 'chooseAbility', arg: abilityChoice.id, card: abilityChoice.card };
            })
            .sortBy('text')
            .value();

        this.game.promptWithMenu(this.game.getFirstPlayer(), this, {
            activePrompt: {
                menuTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.events[0]),
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponents to resolve forced abilities'
        });
    }

    chooseAbility(player, id) {
        let choice = _.find(this.abilityChoices, ability => ability.id === id);

        if(!choice) {
            return false;
        }
        if(this.abilityType === 'whenrevealed') {
            this.game.addMessage('{0} has chosen to resolve first the when revealed ability of {1}\'s {2}',
                player, choice.player.name, choice.card.name);
        }

        this.game.resolveAbility(choice.ability, choice.context);
        this.abilityChoices = _.reject(this.abilityChoices, ability => ability.card === choice.card);

        return true;
    }
}

module.exports = ForcedTriggeredAbilityWindow;
