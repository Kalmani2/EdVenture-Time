from flask import Flask, jsonify

# Create a Flask application instance
app = Flask(__name__)

# Define data structure for the historical and civil rights info
history_data = {
    "roman_empire": {
        "colosseum_gladiator_fighting": {
            "random_fact": "Many gladiators were slaves, criminals, or prisoners of war.",
            "questions": [
                {"question": "Who were most of the gladiators?", "answer": "Most of the gladiators were slaves, criminals, or prisoners of war."},
                {"question": "What was the main purpose of gladiator fights?", "answer": "Gladiator fights were a form of public spectacle and entertainment for the Roman people. They were also used to celebrate victories and demonstrate the power and prowess of Roman emperors."}
            ],
            "multiple_choice": [
                {"question": "How many spectators could the Colosseum hold?", "options": [
                    {"answer": "20,000", "correct": False},
                    {"answer": "30,000", "correct": False},
                    {"answer": "50,000-80,000", "correct": True}
                ]}
            ]
        },
        "architecture": {
            "random_fact": "The Romans pioneered the architectural design of the arch.",
            "questions": [
                {"question": "What architectural design did the Romans pioneer?", "answer": "The Romans pioneered the architectural design of the arch."},
                {"question": "How did the architectural design of the arch benefit the Romans?", "answer": "The arch allowed the Romans to build larger, more stable structures. It was also used in the construction of aqueducts, which helped transport water across vast distances."}
            ],
            "multiple_choice": [
                {"question": "Which of the following is a famous example of Roman architecture?", "options": [
                    {"answer": "The Leaning Tower of Pisa", "correct": False},
                    {"answer": "The Colosseum", "correct": True},
                    {"answer": "The Eiffel Tower", "correct": False}
                ]}
            ]
        },
        "religion": {
            "random_fact": "The Romans were polytheistic and worshiped a pantheon of gods and goddesses.",
            "questions": [
                {"question": "What type of religion did the Romans practice?", "answer": "The Romans practiced a polytheistic religion and worshiped a pantheon of gods and goddesses."},
                {"question": "How did Roman religion evolve over time?", "answer": "Originally influenced by Greek polytheism, Roman religion evolved over time, gradually incorporating elements of other cultures and faiths. With the rise of Christianity, it eventually became the predominant religion in the Roman Empire."}
            ],
            "multiple_choice": [
                {"question": "Who was the king of the Roman gods?", "options": [
                    {"answer": "Apollo", "correct": False},
                    {"answer": "Hermes", "correct": False},
                    {"answer": "Jupiter", "correct": True}
                ]}
            ]
        }
    },
    "medieval": {
        "torture_methods": {
            "random_fact": "One of the most notorious torture methods used during the Middle Ages was the Judas cradle. Victims were placed on an upwards pointed pyramid-like seat, with the point inserted into their bodies - an incredibly painful method.",
            "questions": [
                {"question": "What was the purpose behind the use of torture in the Middle Ages?", "answer": "The purpose of torture was primarily to extract confessions or information. It was also used as a punishment and a means to instill fear."},
                {"question": "Was there any regulation around the use of torture?", "answer": "In the early Middle Ages, torture was not widely regulated, and was often brutal and used without reservations. However, by the late Middle Ages, laws began to emerge tempering its use somewhat."}
            ],
            "multiple_choice": [
                {"question": "Which of these torture devices was not used during the Middle Ages?", "options": [
                    {"answer": "The Rack", "correct": False},
                    {"answer": "Iron Maiden", "correct": False},
                    {"answer": "The Electric Chair", "correct": True}
                ]}
            ]
        },
        "weaponry": {
            "random_fact": "The English Longbow, used in the Middle Ages, had a range of around 250 yards and could penetrate armor at distances greater than 200 yards.",
            "questions": [
                {"question": "What was the significance of learning to use a longbow?", "answer": "Mastery of the longbow took years of practice and was of significant tactical importance in warfare. It had great firepower and range, allowing soldiers to keep enemies at a distance."},
                {"question": "What was the most common weapon used by knights during the Medieval period?", "answer": "The most common weapon used by knights was the sword, although they were also trained to use a variety of other weapons."}
            ],
            "multiple_choice": [
                {"question": "What was the primary material used to manufacture medieval weapons?", "options": [
                    {"answer": "Bronze", "correct": False},
                    {"answer": "Iron", "correct": True},
                    {"answer": "Steel", "correct": False}
                ]}
            ]
        },
        "architecture": {
            "random_fact": "Most domestic buildings in the Middle Ages were constructed with timber and wattle and daub. Only the wealthy could afford to build and maintain stone buildings.",
            "questions": [
                {"question": "What was the predominant architectural style of the Middle Ages?", "answer": "The Gothic style was the predominant architectural style of the Middle Ages, characterized by pointed arches, ribbed vaults, and flying buttresses."},
                {"question": "What was the most significant type of building in Medieval architecture?", "answer": "The most significant and common building in Medieval architecture was the Christian church, serving both religious and community functions."}
            ],
            "multiple_choice": [
                {"question": "What is a distinctive feature of Gothic architecture?", "options": [
                    {"answer": "Massive round columns", "correct": False},
                    {"answer": "Flat roofs", "correct": False},
                    {"answer": "Pointed arches", "correct": True}
                ]}
            ]
        }
    },
    "civil_rights": {
        "rosa_parks": {
            "random_fact": "Rosa Parks, on December 1, 1955, in Montgomery, Alabama, refused to give up her seat on a bus for a white person, which was required by the law at the time.",
            "questions": [
                {"question": "What was the consequence of Rosa Parks' action?", "answer": "Her act of defiance triggered the Montgomery Bus Boycott, a significant event in the civil rights movement."},
                {"question": "Was Rosa Parks the first person to resist bus segregation?", "answer": "No, there were several others before Rosa, including Claudette Colvin who refused to give up her seat nine months prior, but Rosa Parks’ case became more famous and sparked wider protest."}
            ],
            "multiple_choice": [
                {"question": "What is the name of the boycott that Rosa Parks’s bus arrest led to?", "options": [
                    {"answer": "Birmingham Campaign", "correct": False},
                    {"answer": "Memphis Sanitation Strike", "correct": False},
                    {"answer": "Montgomery Bus Boycott", "correct": True}
                ]}
            ]
        },
        "martin_luther_king": {
            "random_fact": "Martin Luther King, Jr's 'I Have a Dream' speech during the March on Washington in 1963 is considered one of the greatest speeches in American history.",
            "questions": [
                {"question": "What kind of strategies did Martin Luther King, Jr. advocate for in achieving social equality?", "answer": "He advocated for nonviolent forms of protest, including civil disobedience and peaceful protests. The philosophy of his movement was heavily influenced by Mahatma Gandhi’s principles of non-violence."},
                {"question": "How did Martin Luther King, Jr. die?", "answer": "Martin Luther King Jr. was assassinated on April 4, 1968, in Memphis, Tennessee."}
            ],
            "multiple_choice": [
                {"question": "Who was the man accused of assassinating Martin Luther King Jr.?", "options": [
                    {"answer": "Sirhan Sirhan", "correct": False},
                    {"answer": "James Earl Ray", "correct": True},
                    {"answer": "Lee Harvey Oswald", "correct": False}
                ]}
            ]
        },
        "ruby_bridges": {
            "random_fact": "Ruby Bridges, at the age of six, was the first African American child to desegregate an all-white elementary school in the South (New Orleans, Louisiana).",
            "questions": [
                {"question": "What year did Ruby Bridges integrate an all-white school?", "answer": "Ruby Bridges integrated the all-white William Frantz Elementary School on November 14, 1960."},
                {"question": "Did Ruby Bridges continue her education despite the challenges she faced?", "answer": "Yes, despite acute societal pressures and hostility, Ruby Bridges continued her education, demonstrating remarkable resilience."}
            ],
            "multiple_choice": [
                {"question": "Which U.S. president ordered federal protection for Ruby Bridges when she integrated a New Orleans school?", "options": [
                    {"answer": "John F. Kennedy", "correct": True},
                    {"answer": "Dwight D. Eisenhower", "correct": False},
                    {"answer": "Lyndon B. Johnson", "correct": False}
                ]}
            ]
        }
    }
}

@app.route('/')
def home():
    return "Welcome to the Historical Facts API!"

# Route for Roman Empire
@app.route('/roman_empire')
def roman_empire():
    return jsonify(history_data['roman_empire'])

# Route for Medieval History
@app.route('/medieval')
def medieval():
    return jsonify(history_data['medieval'])

# Route for Civil Rights
@app.route('/civil_rights')
def civil_rights():
    return jsonify(history_data['civil_rights'])

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
