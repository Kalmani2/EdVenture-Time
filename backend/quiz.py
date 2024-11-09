import json

def load_questions(filename="history_topics.json"):
    """Load the questions from the generated JSON file."""
    try:
        with open(filename, 'r') as file:
            data = json.load(file)
        return data
    except FileNotFoundError:
        print("Error: The file does not exist.")
        return None
    except json.JSONDecodeError:
        print("Error: The file is not a valid JSON.")
        return None

def ask_question(question, options, correct_answer):
    """Display the question and options, and check if the answer is correct."""
    print(f"\nQuestion: {question}")
    for idx, option in enumerate(options, 1):
        print(f"{idx}. {option['text']}")
    
    # Get the user's answer
    try:
        answer = int(input("Your answer (1-3): "))
        if answer < 1 or answer > 3:
            raise ValueError("Answer must be between 1 and 3.")
    except ValueError as e:
        print(f"Invalid input: {e}")
        return False  # Treat invalid input as wrong answer

    # Check if the selected option is correct
    if options[answer - 1]["correct"]:
        print("Correct!")
        return True
    else:
        print("Incorrect.")
        return False

def quiz_topic(topic, topic_data):
    """Ask the user to interact with a topic's questions."""
    print(f"\n--- {topic} ---")
    
    # Display the random fact
    print("\nRandom Fact:")
    print(topic_data['random_fact'])

    # Display follow-up questions
    print("\nFollow-up Questions:")
    for i, question in enumerate(topic_data['follow_up_questions']):
        print(f"{i + 1}. {question}")
    
    # Ask questions for each subtopic
    score = 0
    total_questions = 0
    for subtopic, subtopic_data in topic_data['subtopics'].items():
        print(f"\n--- {subtopic} ---")
        total_questions += 1
        # Ask the multiple-choice question
        if ask_question(subtopic_data['question'], subtopic_data['options'], subtopic_data):
            score += 1
    
    # Display the score
    print(f"\nYou answered {score} out of {total_questions} questions correctly for the topic: {topic}.")

def main():
    # Load the quiz data from the JSON file
    data = load_questions("history_topics.json")
    if not data:
        return

    # Loop through each topic and present the quiz
    for topic, topic_data in data.items():
        quiz_topic(topic, topic_data)

    print("\nQuiz completed! Thank you for playing.")

if __name__ == "__main__":
    main()
