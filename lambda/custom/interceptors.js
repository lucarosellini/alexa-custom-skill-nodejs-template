// i18n dependency
const i18n = require('i18next');
const languageStrings = require('./localisation');

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the handlerInput.
// Additionally it will handle picking a random value if instead of a string it receives an array
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        const localisationClient = i18n.init({
            lng: handlerInput.requestEnvelope.request.locale,
            resources: languageStrings,
            returnObjects: true
        });
        localisationClient.localise = function localise() {
            const args = arguments;
            const value = i18n.t(...args);
            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            }
            return value;
        };
        handlerInput.t = function translate(...args) {
            return localisationClient.localise(...args);
        }
    }
};

const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;

        try {
            const sessionAttributes = attributesManager.getSessionAttributes();
            if(requestEnvelope.session['new'] || !sessionAttributes['loaded']){ //is this a new session? not loaded from db?
                const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
                console.log('Loading from persistent storage: ' + JSON.stringify(persistentAttributes));
                persistentAttributes['loaded'] = true;
                //copy persistent attribute to session attributes
                attributesManager.setSessionAttributes(persistentAttributes);
            }
        } catch (err){
            console.log("Cannot execute LoadAttributesRequestInterceptor", JSON.stringify(err));
        }
    }
};

const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        if(!response) return; // avoid intercepting calls that have no outgoing response due to errors
        const {attributesManager, requestEnvelope} = handlerInput;

        // clones session attributes

        try {
            const sessionAttributes = JSON.parse(JSON.stringify(attributesManager.getSessionAttributes()));
            //console.log("sessionAttributes", JSON.stringify(sessionAttributes));
            const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession); //is this a session end?
            const loadedThisSession = sessionAttributes['loaded'];
            if((shouldEndSession || requestEnvelope.request.type === 'SessionEndedRequest') && loadedThisSession) { // skill was stopped or timed out
                delete sessionAttributes['loaded'];
                delete sessionAttributes['providerSelectionErrors'];
                console.log('Saving to persistent storage:' + JSON.stringify(sessionAttributes));
                attributesManager.setPersistentAttributes(sessionAttributes);
                await attributesManager.savePersistentAttributes();
            }
        } catch (err){
            console.log("Cannot execute SaveAttributesResponseInterceptor", JSON.stringify(err));
        }
    }
};

const LoadTimezoneRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const deviceId = requestEnvelope.context.System.device.deviceId;

        if(!requestAttributes['timezone']){
            // let's try to get the timezone via the UPS API
            // (no permissions required but it might not be set up)
            try {
                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                const timezone = await upsServiceClient.getSystemTimeZone(deviceId);
                if (timezone) { // the user might not have set the timezone yet
                    console.log('Got timezone from device: ' + timezone);
                    //save to session and persisten attributes
                    requestAttributes['timezone'] = timezone;
                    attributesManager.setRequestAttributes(requestAttributes);
                } else {
                    delete requestAttributes['timezone'];
                }
            } catch (error) {
                console.log(JSON.stringify(error));
                delete requestAttributes['timezone'];
            }
        }
    }
};

const LastIntentResponseInterceptor = { 
    process(handlerInput, response) { 
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {request} = requestEnvelope; 

        if(!request.intent || (request.intent && request.intent.name !== 'FallbackIntent')){
            sessionAttributes['prevRequest']  = request.intent ? request.intent.name : request.type;
        }
        console.log('PREVIOUS REQUEST: ' + JSON.stringify(sessionAttributes['prevRequest']));
        attributesManager.setSessionAttributes(sessionAttributes); 
    } 
};

module.exports = {
    LoggingRequestInterceptor,
    LoggingResponseInterceptor,
    LocalisationRequestInterceptor,
    LoadAttributesRequestInterceptor,
    SaveAttributesResponseInterceptor,
    LoadTimezoneRequestInterceptor,
    LastIntentResponseInterceptor
}