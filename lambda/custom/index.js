// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const interceptors = require('./interceptors');
const persistence = require("./persistence");
const constants = require("./constants");
const mail = require("./mail");
const utils = require("./utils");

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        utils.updateStatus(handlerInput);
        const request = handlerInput.requestEnvelope.request;
        const { serviceClientFactory, responseBuilder } = handlerInput;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    
        const accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

        let speakOutput = "";

        if (!accessToken) {
            /* This is the first time the user uses the skill. 
               Check if the user has done account linking. 
             */
            speakOutput = handlerInput.t('WELCOME_MESSAGE_FIRST_TIME', { skill_name: constants.skill_name }) +
                handlerInput.t('ACCOUNT_LINKING_REQUIRED');

            return responseBuilder
                .speak(speakOutput)
                .withLinkAccountCard()
                .withShouldEndSession(true)
                .getResponse();
        }

        if (!sessionAttributes.status) {
            speakOutput = handlerInput.t('WELCOME_MESSAGE_FIRST_TIME', { skill_name: constants.skill_name }) +
                handlerInput.t('WELCOME_MESSAGE_CTA') +
                handlerInput.t('WHAT_DO_YOU_WANT_TO_DO');

            return responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }

        // Check if we have access to user's name
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();
        const profileName = '';

        try {
            profileName = await upsServiceClient.getProfileGivenName();
        } catch (e) {
            console.log("Permission to access given name not granted");
        }
        if (!profileName) {
            speakOutput = handlerInput.t('WELCOME_MESSAGE_FIRST_TIME', { skill_name: constants.skill_name }) +
                handlerInput.t('WELCOME_MESSAGE_CTA') +
                handlerInput.t('WHAT_DO_YOU_WANT_TO_DO');
        } else {
            speakOutput = profileName + ', ' +
                handlerInput.t('WELCOME_MESSAGE_FIRST_TIME', { skill_name: constants.skill_name }) +
                handlerInput.t('WELCOME_MESSAGE_CTA') +
                handlerInput.t('WHAT_DO_YOU_WANT_TO_DO');
        }

        return responseBuilder
            .speak(speakOutput)
            .reprompt(handlerInput.t('WHAT_DO_YOU_WANT_TO_DO'))
            .getResponse();
    }
};
const CheckEmailIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CheckEmailIntent';
    },
    async handle(handlerInput) {
        utils.updateStatus(handlerInput);
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

        if (!accessToken) {
            return LaunchRequestHandler.handle(handlerInput);
        }

        const unreadEmails = await mail.countUnreadEmails(accessToken);

        //const slot = Alexa.getSlot(handlerInput.requestEnvelope, "userName");

        //console.log("userName slot: ", JSON.stringify(slot));
        let speakOutput = '';
        if (unreadEmails == 0){
            speakOutput = handlerInput.t('NO_UNREAD_EMAILS');
        } else if (unreadEmails == 1){
            speakOutput = handlerInput.t('UNREAD_EMAIL');
        } else {
            speakOutput = handlerInput.t('UNREAD_EMAILS', { unread_emails: unreadEmails });
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const ReadEmailsIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ReadEmailsIntent';
    },
    handle(handlerInput) {
        utils.updateStatus(handlerInput);
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

        if (!accessToken) {
            return LaunchRequestHandler.handle(handlerInput);
        }

        const slot = Alexa.getSlot(handlerInput.requestEnvelope, "userName");

        console.log("userName slot: ", JSON.stringify(slot));


        const speakOutput = handlerInput.t('GREETING_MSG');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};


// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = handlerInput.t('REFLECTOR_MSG', { intent: intentName });

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speechText = handlerInput.t('ERROR_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        FallbackIntentHandler,
        CheckEmailIntentHandler,
        ReadEmailsIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addRequestInterceptors(
        interceptors.LocalisationRequestInterceptor,
        interceptors.LoggingRequestInterceptor,
        interceptors.LoadAttributesRequestInterceptor,
        interceptors.LoadTimezoneRequestInterceptor,
    )
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.LastIntentResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor)
    .addErrorHandlers(
        ErrorHandler)
    .withPersistenceAdapter(persistence.getPersistenceAdapter())
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();
