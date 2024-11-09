import openai
import os
import json

# Make sure to set your OpenAI API key either directly in the script or in your environment
openai.api_key = os.getenv("OPENAI_API_KEY")  # Ensure your environment has this key set

def generate_topic_info(topic_name, subtopics):
    # Create the prompt dynamically based on the topic
    prompt = f"""
    You are an expert in history, and you will provide detailed information on the following topic: {topic_name}.
    For each of the following subtopics, generate:
    1. A random fact about the topic.
    2. A suggested follow-up question.
    3. The answer to the follow-up question.
    4. A multiple-choice question with 3 options (1 correct and 2 incorrect).

    Please return the information in the following format for each subtopic:
    - Subtopic: [subtopic name]
    - Random fact: [random fact about the subtopic]
    - Suggested question 1: [first suggested question]
    - Suggested question 1's answer: [answer to suggested question 1]
    - Suggested question 2: [second suggested question]
    - Suggested question 2's answer: [answer to suggested question 2]
    - Multiple-choice question: [the multiple choice question]
    - MQ answer 1: [first incorrect answer option]
    - MQ answer 2: [second incorrect answer option]
    - MQ answer 3: [correct answer option]
    
    Subtopics: {', '.join(subtopics)}
    """

    # Prepare the conversation history for the chat-based model
    conversation_history = [{"role": "system", "content": "You are a helpful assistant knowledgeable in history."}]
    conversation_history.append({"role": "user", "content": prompt})

    # Query OpenAI API to generate content using the correct endpoint for chat-based models
    response = openai.ChatCompletion.create(
        model="gpt-4",  # or use "gpt-3.5-turbo"
        messages=conversation_history,
        max_tokens=1500  # Increased token limit to accommodate the generated content
    )

    # Extract and return the generated content
    return response['choices'][0]['message']['content']

def save_to_json(data, filename="history_topics.json"):
    # Save the generated content to a JSON file
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

def save_response_to_file(response, topic_name):
    # Save the raw OpenAI response to a text file for inspection
    filename = f"openai_response_{topic_name}.txt"
    with open(filename, 'w') as file:
        file.write(response)
    print(f"Response for topic '{topic_name}' saved to {filename}.")

def process_response_to_json(response, topic_name):
    """
    Process the raw response from OpenAI and convert it into a structured format for JSON.
    """
    all_subtopics_info = {}
    subtopic_lines = response.split("\n")
    
    subtopic = None
    subtopic_info = {}

    for line in subtopic_lines:
        if line.startswith("Subtopic:"):
            # Save the previous subtopic info if it exists
            if subtopic:
                all_subtopics_info[subtopic] = subtopic_info
            
            # Start a new subtopic
            subtopic = line.split(":")[1].strip()
            subtopic_info = {}
        elif line.startswith("Random fact:"):
            subtopic_info["random fact"] = line.split(":")[1].strip()
        elif line.startswith("Suggested question 1:"):
            subtopic_info["suggested question 1"] = line.split(":")[1].strip()
        elif line.startswith("Suggested question 1's answer:"):
            subtopic_info["suggested question 1's answer"] = line.split(":")[1].strip()
        elif line.startswith("Suggested question 2:"):
            subtopic_info["suggested question 2"] = line.split(":")[1].strip()
        elif line.startswith("Suggested question 2's answer:"):
            subtopic_info["suggested question 2's answer"] = line.split(":")[1].strip()
        elif line.startswith("Multiple-choice question:"):
            subtopic_info["multiple choice question"] = line.split(":")[1].strip()
        elif line.startswith("MQ answer 1:"):
            subtopic_info["mq answer 1"] = line.split(":")[1].strip()
        elif line.startswith("MQ answer 2:"):
            subtopic_info["mq answer 2"] = line.split(":")[1].strip()
        elif line.startswith("MQ answer 3:"):
            subtopic_info["mq answer 3"] = line.split(":")[1].strip()

    # Don't forget to save the last subtopic
    if subtopic:
        all_subtopics_info[subtopic] = subtopic_info

    # Debugging: Print the structured data to verify it's correct
    print(f"Processed data for topic '{topic_name}': {json.dumps(all_subtopics_info, indent=4)}")
    
    return all_subtopics_info

def main():
    topics = {
        "Roman": ["Colosseum Gladiator Fighting", "Architecture", "Religion"],
        "Medieval": ["Torture Methods", "Weaponry", "Architecture"],
        "Civil Rights Movement": ["Rosa Parks", "Martin Luther King", "Ruby Bridges"]
    }

    # Data structure to store the generated information for each topic
    all_topics_info = {}

    for topic, subtopics in topics.items():
        print(f"Generating content for: {topic}...")
        # Generate content dynamically using OpenAI
        generated_content = generate_topic_info(topic, subtopics)

        # Save the raw response from OpenAI to a file
        save_response_to_file(generated_content, topic)

        # Process the response and extract structured data
        topic_info = process_response_to_json(generated_content, topic)

        # Add the processed topic info to the overall data structure
        all_topics_info[topic] = topic_info

    # Save the structured content to a JSON file
    save_to_json(all_topics_info)

    print("Content saved to history_topics.json.")

if __name__ == "__main__":
    main()
