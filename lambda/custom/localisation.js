
const DOUBT_SPEECHCON = `<say-as interpret-as="interjection">ay ay ay</say-as>`;
const HOLA_SPEECHCON = `<say-as interpret-as="interjection">hola</say-as>`;
const QUETAL_SPEECHCON = `<say-as interpret-as="interjection">¿qué tal?</say-as>`;
const GENIAL_SPEECHCON = `<say-as interpret-as="interjection">genial</say-as>`;

module.exports = {
    es: {
        translation: {
            WELCOME_MESSAGE: 'Te damos la bienvenida, {{user_name}}. Qué quieres hacer?',
            WELCOME_MESSAGE_REPROMPT: 'No te he entendido. Qué quieres hacer?',
            WELCOME_BACK_MESSAGE: 'Te volvemos a dar la bienvenida, {{user_name}}',
            GREETING_MSG: QUETAL_SPEECHCON + '. ',
            PERSONALIZED_GREETING_MSG: QUETAL_SPEECHCON + ' {{user_name}}! ',
            HELP_MSG: ' Puedes pedirme el consejo del día. También puedo darte uno sobre alimentación o ejercicio. ',
            REFLECTOR_MSG: 'Acabas de activar {{intent}}',
            FALLBACK_MSG: 'Lo siento, no te he entendido. ',
            ERROR_MSG: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez. '
        }
    }
}