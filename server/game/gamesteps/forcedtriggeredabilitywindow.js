const _ = require('underscore');
const uuid = require('uuid');

const BaseStep = require('./basestep.js');
const TriggeredAbilityWindowTitles = require('./triggeredabilitywindowtitles.js');

class ForcedTriggeredAbilityWindow extends BaseStep {
    constructor(game, properties) {
        super(game);
        this.abilityChoices = [];
        this.event = properties.event;
        this.abilityType = properties.abilityType;
    }

    registerAbility(ability, context) {
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
                return { text: title, method: 'chooseAbility', arg: abilityChoice.id, card: abilityChoice.card.getSummary(true) };
            })
            .sortBy('text')
            .value();

        this.game.promptWithMenu(this.game.getFirstPlayer(), this, {
            activePrompt: {
                menuTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.event),
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

        this.game.resolveAbility(choice.ability, choice.context);
        this.abilityChoices = _.reject(this.abilityChoices, ability => ability.card === choice.card);

        return true;
    }
}

module.exports = ForcedTriggeredAbilityWindow;
