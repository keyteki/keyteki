const MessageService = require('./MessageService');
const CardService = require('./CardService');

let services = {};

module.exports = {
    messageService: () => {
        if(!services.messageService) {
            services.messageService = new MessageService();
        }

        return services.messageService;
    },
    cardService: () => {
        if(!services.cardService) {
            services.cardService = new CardService();
        }

        return services.cardService;
    }
};
