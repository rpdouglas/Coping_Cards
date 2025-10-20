// Import Workbook data from its own dedicated file
import { 
    WORKBOOK_STEP1_QUESTIONS, 
    WORKBOOK_STEP2_QUESTIONS, 
    WORKBOOK_STEP3_QUESTIONS, 
    WORKBOOK_STEP4_QUESTIONS,
    WORKBOOK_STEP5_QUESTIONS,
    WORKBOOK_STEP6_QUESTIONS,
    WORKBOOK_STEP7_QUESTIONS,
    WORKBOOK_STEP8_QUESTIONS,
    WORKBOOK_STEP9_QUESTIONS,
    WORKBOOK_STEP10_QUESTIONS,
    WORKBOOK_STEP11_QUESTIONS,
    WORKBOOK_STEP12_QUESTIONS
} from './workbook_data.js';

// --- COPING CARDS DATA ---
const cards = [
    {suit: 'Action & Movement', suit_key: 'blue', icon: '🏃‍♂️', text: 'Tense and then relax your muscles. Repeat 3 times.'},
    {suit: 'Action & Movement', suit_key: 'blue', icon: '🏃‍♂️', text: 'Do 10 jumping jacks or jog in place for 30 seconds.'},
    {suit: 'Action & Movement', suit_key: 'blue', icon: '🏃‍♂️', text: 'Stretch your entire body for 60 seconds.'},
    {suit: 'Action & Movement', suit_key: 'blue', icon: '🏃‍♂️', text: 'Go for a walk, even if it is just a lap around the house.'},
    {suit: 'Action & Movement', suit_key: 'blue', icon: '🏃‍♂️', text: 'Take 5 deep breaths, focusing only on the air moving in and out.'},
    {suit: 'Action & Movement', suit_key: 'blue', icon: '🏃‍♂️', text: 'Clean an area of your home for 5 minutes (e.g., wash a few dishes).'},
    {suit: 'Action & Movement', suit_key: 'blue', icon: '🏃‍♂️', text: 'Do a quick chore like taking out the trash or folding one piece of laundry.'},
    {suit: 'Action & Movement', suit_key: 'blue', icon: '🏃‍♂️', text: 'Drink a full glass of water or a soothing hot beverage.'},
    {suit: 'Action & Movement', suit_key: 'blue', icon: '🏃‍♂️', text: 'Splash cold water on your face.'},
    {suit: 'Action & Movement', suit_key: 'blue', icon: '🏃‍♂️', text: 'Change your location. Move to another room or step outside.'},
    {suit: 'Action & Movement', suit_key: 'blue', icon: '🏃‍♂️', text: 'Do a 2-minute wall sit or plank.'},
    {suit: 'Action & Movement', suit_key: 'blue', icon: '🏃‍♂️', text: 'Hold ice in your hand for a minute until the feeling subsides.'},
    {suit: 'Action & Movement', suit_key: 'blue', icon: '🏃‍♂️', text: 'Eat a small, healthy snack, like a piece of fruit.'},
    
    {suit: 'Mind & Focus', suit_key: 'green', icon: '🧠', text: 'Use a grounding technique. Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.'},
    {suit: 'Mind & Focus', suit_key: 'green', icon: '🧠', text: 'Write down three things you are grateful for right now.'},
    {suit: 'Mind & Focus', suit_key: 'green', icon: '🧠', text: 'Picture a favorite memory, like a vacation or a celebration. Focus on the details.'},
    {suit: 'Mind & Focus', suit_key: 'green', icon: '🧠', text: 'Say a positive affirmation out loud 10 times.'},
    {suit: 'Mind & Focus', suit_key: 'green', icon: '🧠', text: 'Watch a funny video or read a lighthearted article.'},
    {suit: 'Mind & Focus', suit_key: 'green', icon: '🧠', text: 'Try to recall the lyrics to your favorite song, word for word.'},
    {suit: 'Mind & Focus', suit_key: 'green', icon: '🧠', text: 'Look at a complex image or pattern and try to find a repeating element.'},
    {suit: 'Mind & Focus', suit_key: 'green', icon: '🧠', text: 'Do a quick Sudoku or word search puzzle.'},
    {suit: 'Mind & Focus', suit_key: 'green', icon: '🧠', text: 'Listen to a guided meditation for 5 minutes.'},
    {suit: 'Mind & Focus', suit_key: 'green', icon: '🧠', text: 'Imagine the feeling of the craving passing and how good it will feel.'},
    {suit: 'Mind & Focus', suit_key: 'green', icon: '🧠', text: 'Read a book or news article for 5 minutes.'},
    {suit: 'Mind & Focus', suit_key: 'green', icon: '🧠', text: 'Do a body scan. Focus on each part of your body from head to toe.'},
    {suit: 'Mind & Focus', suit_key: 'green', icon: '🧠', text: 'Mentally list all the cities or states you can remember.'},

    {suit: 'Connection & Support', suit_key: 'orange', icon: '💬', text: 'Call or text a supportive friend or family member.'},
    {suit: 'Connection & Support', suit_key: 'orange', icon: '💬', text: 'Check in with your sponsor or accountability partner.'},
    {suit: 'Connection & Support', suit_key: 'orange', icon: '💬', text: 'Send a quick encouraging text to someone else in recovery.'},
    {suit: 'Connection & Support', suit_key: 'orange', icon: '💬', text: 'Write down a commitment you can share with a friend later.'},
    {suit: 'Connection & Support', suit_key: 'orange', icon: '💬', text: 'Read a few passages from an inspirational book or literature.'},
    {suit: 'Connection & Support', suit_key: 'orange', icon: '💬', text: 'Go online to find a quick, virtual support meeting.'},
    {suit: 'Connection & Support', suit_key: 'orange', icon: '💬', text: 'Write a quick email or note to thank someone in your life.'},
    {suit: 'Connection & Support', suit_key: 'orange', icon: '💬', text: 'Say your name and what you are feeling right now out loud to an empty room.'},
    {suit: 'Connection & Support', suit_key: 'orange', icon: '💬', text: 'Think about who in your life you could help with something small today.'},
    {suit: 'Connection & Support', suit_key: 'orange', icon: '💬', text: 'Reach out to a professional (therapist, doctor) for advice if the craving persists.'},
    {suit: 'Connection & Support', suit_key: 'orange', icon: '💬', text: 'Talk to a pet or plant for 5 minutes.'},
    {suit: 'Connection & Support', suit_key: 'orange', icon: '💬', text: 'Offer a genuine compliment to a stranger or person nearby.'},
    {suit: 'Connection & Support', suit_key: 'orange', icon: '💬', text: 'Read through old notes or cards from loved ones.'},

    {suit: 'Creative & Learning', suit_key: 'purple', icon: '🎨', text: 'Write a short story or poem about your current feeling.'},
    {suit: 'Creative & Learning', suit_key: 'purple', icon: '🎨', text: 'Listen to a piece of classical music you’ve never heard before.'},
    {suit: 'Creative & Learning', suit_key: 'purple', icon: '🎨', text: 'Draw or doodle for 5 minutes without judging the result.'},
    {suit: 'Creative & Learning', suit_key: 'purple', icon: '🎨', text: 'Watch a short documentary or educational video on a random topic.'},
    {suit: 'Creative & Learning', suit_key: 'purple', icon: '🎨', text: 'Pick up a new musical instrument (even a simple one) and try it.'},
    {suit: 'Creative & Learning', suit_key: 'purple', icon: '🎨', text: 'Look up a recipe and plan to make it later this week.'},
    {suit: 'Creative & Learning', suit_key: 'purple', icon: '🎨', text: 'Browse an online museum or art gallery.'},
    {suit: 'Creative & Learning', suit_key: 'purple', icon: '🎨', text: 'Start a journal entry about your goals for the next month.'},
    {suit: 'Creative & Learning', suit_key: 'purple', icon: '🎨', text: 'Learn a few words in a new language using an app or website.'},
    {suit: 'Creative & Learning', suit_key: 'purple', icon: '🎨', text: 'Write down the ABCs backwards.'},
    {suit: 'Creative & Learning', suit_key: 'purple', icon: '🎨', text: 'Look up the definition of a word you don’t know and use it in a sentence.'},
    {suit: 'Creative & Learning', suit_key: 'purple', icon: '🎨', text: 'Do something tactile, like playing with modeling clay or sand.'},
    {suit: 'Creative & Learning', suit_key: 'purple', icon: '🎨', text: 'Try to balance an object on your finger for 60 seconds.'}
];

// --- DAILY FACTS ---
const POP_FACTS = [
    "Actor Robert Downey Jr. pursued martial arts and therapy in his recovery, stating: 'Job one is get out of that cave.'",
    "Actress Jamie Lee Curtis has been sober since 1999, crediting sobriety with giving her everything of value in her life.",
    "Bradley Cooper, sober since 2004, credits his sobriety with saving his career.",
    "Musician Elton John established the Elton John AIDS Foundation two years after entering recovery in 1990.",
    "Actor Daniel Radcliffe sought sobriety in 2010 to cope with anxiety and stress after the Harry Potter series.",
    "Drew Barrymore went to rehab at age 13 and is now a successful actress and talk show host.",
    "Actor Danny Trejo has been sober for over 50 years, having gotten clean well before his career took off.",
    "Samuel L. Jackson got sober in the early 1990s, realizing his acting career would require it.",
    "AA was founded in 1935 in Akron, Ohio, by Bill Wilson and Dr. Bob Smith.",
    "The 12 Steps were first outlined in the book 'Alcoholics Anonymous,' often called the Big Book.",
    "The Big Book's chapter 'How It Works' is frequently read at the beginning of AA meetings.",
    "The central purpose of AA is to stay sober and help other alcoholics achieve sobriety.",
    "AA's tradition of anonymity ensures that members are judged by actions, not reputation.",
    "The spiritual foundation of AA is based on a 'Power greater than ourselves.'",
    "Many recovery programs use adapted versions of the 12 Steps.",
    "Dr. Bob's sobriety date, June 10, 1935, is celebrated as the founding date of AA.",
    "AA operates on three legacies: Recovery (Steps), Unity (Traditions), and Service (Concepts).",
    "The Serenity Prayer is widely used in AA and other 12-Step programs.",
    "The only requirement for AA membership is a desire to stop drinking.",
    "In AA, sponsorship is key: a recovered alcoholic helps a newcomer work the Steps.",
    "The 12th Step emphasizes carrying the message and practicing the principles in all affairs.",
    "AA is self-supporting through member contributions.",
    "The 'third tradition' states that the only requirement for AA membership is a desire to stop drinking.",
    "AA's slogan 'One Day at a Time' encourages focusing on staying sober for the next 24 hours.",
    "The AA symbol is a circle enclosing a triangle, representing Unity, Recovery, and Service.",
    "AA has grown to an estimated two million members worldwide today.",
    "The concept of 'Higher Power' is left to individual interpretation in AA.",
    "The Twelve Traditions govern how AA groups and the fellowship operate."
];

// --- DEFAULT JOURNAL PROMPTS ---
const DEFAULT_PROMPTS = [
    {name: "None (Free Write)", template: ""},
    {name: "HALT Check-in", template: "Hungry: Am I hungry? What can I eat?\nAngry: What am I angry about? How can I safely express it?\nLonely: Who can I reach out to right now?\nTired: What rest do I need? How can I relax?"},
    {name: "Coping Card Reflection", template: "The card I drew today was: [Insert Card Text Here]\nHow did I use this coping skill?\nWhat was the result?\nWhat craving did I overcome today?"},
    {name: "Today's Gratitude", template: "I am grateful for 3 big things today:\n1.\n2.\n3.\nI am grateful for 3 small things today:\n1.\n2.\n3."},
    {name: "Future Goal Setting", template: "One small recovery goal for tomorrow is:\nOne large life goal I'm moving toward is:\nWhat steps can I take today to prepare for tomorrow?"}
];

// --- EXPORT ALL STATIC DATA ---
export const AppData = {
    cards,
    POP_FACTS,
    DEFAULT_PROMPTS,
    WORKBOOK_STEP1_QUESTIONS,
    WORKBOOK_STEP2_QUESTIONS,
    WORKBOOK_STEP3_QUESTIONS,
    WORKBOOK_STEP4_QUESTIONS,
    WORKBOOK_STEP5_QUESTIONS,
    WORKBOOK_STEP6_QUESTIONS,
    WORKBOOK_STEP7_QUESTIONS,
    WORKBOOK_STEP8_QUESTIONS,
    WORKBOOK_STEP9_QUESTIONS,
    WORKBOOK_STEP10_QUESTIONS,
    WORKBOOK_STEP11_QUESTIONS,
    WORKBOOK_STEP12_QUESTIONS,
};
