const startButton = document.getElementById('start-button');
const readTranslationButton = document.getElementById('read-translation-button');
const transcriptionField = document.getElementById('transcription');
const translationField = document.getElementById('translation');
const languageSelect = document.getElementById('language-select'); // New language select element

// Check for browser support
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false; // Stop automatically after recognizing
    recognition.interimResults = false; // Don't show interim results

    recognition.onstart = function() {
        console.log('Voice recognition started. Speak into the microphone.');
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        transcriptionField.value = transcript; // Insert transcribed text into the text area
        translateText(transcript); // Translate the transcribed text
    };

    recognition.onerror = function(event) {
        console.error('Error occurred in recognition: ' + event.error);
    };

    recognition.onend = function() {
        console.log('Voice recognition ended.');
    };

    startButton.addEventListener('click', function() {
        recognition.start(); // Start voice recognition
    });
} else {
    alert('Sorry, your browser does not support speech recognition.');
}

function translateText(text) {
    const targetLanguage = languageSelect.value; // Get the selected language
    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`)
        .then(response => response.json())
        .then(data => {
            const translatedText = data.responseData.translatedText;
            translationField.value = translatedText; // Insert translated text into the text area
        })
        .catch(error => {
            console.error('Error during translation:', error);
        });
}

// Function to read the translation aloud
function readTranslation(text) {
    if (text) {
        const speech = new SpeechSynthesisUtterance(text); // Create a new utterance
        // Set the language based on selection
        speech.lang = languageSelect.value === 'es' ? 'es-ES' :
                      languageSelect.value === 'de' ? 'de-DE' :
                      'fr-FR';
        speech.volume = 1; // Set volume (0 to 1)
        speech.rate = 1; // Set rate (0.1 to 10)
        speech.pitch = 1; // Set pitch (0 to 2)
        window.speechSynthesis.speak(speech); // Speak the text
    } else {
        alert('No translation available to read.'); // Alert if there's no text to read
    }
}

// Add event listener to the read translation button
readTranslationButton.addEventListener('click', function() {
    const translationText = translationField.value; // Get the text from the translation field
    readTranslation(translationText); // Read the translation aloud
});