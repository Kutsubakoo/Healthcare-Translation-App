import speech_recognition as sr
import pyttsx3
from googletrans import Translator


def recognize_speech_from_mic():
    # Initialize recognizer
    recognizer = sr.Recognizer()

    # Use the microphone as the audio source
    with sr.Microphone() as source:
        print("Please say something...")
        audio = recognizer.listen(source)

        try:
            # Recognize speech using Google Web Speech API
            text = recognizer.recognize_google(audio)
            print(f"You said: {text}")
            return text
        except sr.UnknownValueError:
            print("Sorry, I could not understand the audio.")
            return None
        except sr.RequestError:
            print("Could not request results from Google Speech Recognition service.")
            return None


def translate_text(text, dest_language='es'):
    # Initialize the translator
    translator = Translator()
    translation = translator.translate(text, dest=dest_language)
    return translation.text


def text_to_speech(text):
    # Initialize the text-to-speech engine
    engine = pyttsx3.init()

    # Speak the text
    engine.say(text)
    engine.runAndWait()


if __name__ == "__main__":
    while True:
        recognized_text = recognize_speech_from_mic()

        if recognized_text:
            text_to_speech(recognized_text)

            # Translate the recognized text to Spanish
            translated_text = translate_text(recognized_text)
            print(f"Translated to Spanish: {translated_text}")
            text_to_speech(translated_text)

        # Check if the user wants to stop listening
        user_input = input("Press Enter to listen again or type 'exit' to stop: ")
        if user_input.lower() == 'exit':
            print("Exiting...")
            break