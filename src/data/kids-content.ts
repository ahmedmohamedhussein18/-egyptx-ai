export interface Fact {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuizTopic {
  id: string;
  title: string;
  badgeKey: string;
  badgeName: string;
  badgeIcon: string;
  questions: QuizQuestion[];
}

export const KIDS_FACTS: Fact[] = [
  {
    id: 'f1',
    title: 'The Great Pyramid',
    description: 'The Great Pyramid of Giza was built for King Khufu and was the tallest building in the world for over 3,800 years!',
    emoji: '🔺'
  },
  {
    id: 'f2',
    title: 'The Nile River',
    description: 'The Nile is the longest river in the world. Ancient Egyptians relied on its annual floods to grow their crops.',
    emoji: '🌊'
  },
  {
    id: 'f3',
    title: 'Hieroglyphs',
    description: 'Ancient Egyptians used a writing system called hieroglyphs, which used over 700 different pictures as letters and words.',
    emoji: '👁️'
  },
  {
    id: 'f4',
    title: 'Tutankhamun',
    description: 'King Tut became a pharaoh when he was only 9 years old! His nearly intact tomb was discovered in 1922.',
    emoji: '👑'
  },
  {
    id: 'f5',
    title: 'Mummification',
    description: 'Mummification was a special process used to preserve bodies. It could take up to 70 days to make a mummy!',
    emoji: '🤕'
  }
];

export const KIDS_QUIZZES: QuizTopic[] = [
  {
    id: 'q1',
    title: 'Pharaohs & Pyramids',
    badgeKey: 'badge_pyramids',
    badgeName: 'Pyramid Builder',
    badgeIcon: '🔺',
    questions: [
      {
        id: 'q1-1',
        question: 'Who was the Great Pyramid of Giza built for?',
        options: ['King Tut', 'King Khufu', 'Cleopatra'],
        correctAnswerIndex: 1
      },
      {
        id: 'q1-2',
        question: 'How old was King Tut when he became pharaoh?',
        options: ['9 years old', '25 years old', '50 years old'],
        correctAnswerIndex: 0
      },
      {
        id: 'q1-3',
        question: 'What shape are the famous monuments at Giza?',
        options: ['Square', 'Circle', 'Pyramid'],
        correctAnswerIndex: 2
      }
    ]
  },
  {
    id: 'q2',
    title: 'Daily Life & Nature',
    badgeKey: 'badge_nile',
    badgeName: 'Nile Explorer',
    badgeIcon: '🌊',
    questions: [
      {
        id: 'q2-1',
        question: 'What is the name of the famous river in Egypt?',
        options: ['The Amazon', 'The Nile', 'The Thames'],
        correctAnswerIndex: 1
      },
      {
        id: 'q2-2',
        question: 'What was the ancient Egyptian writing system called?',
        options: ['Alphabet', 'Cuneiform', 'Hieroglyphs'],
        correctAnswerIndex: 2
      },
      {
        id: 'q2-3',
        question: 'Why did ancient Egyptians like the Nile river flooding?',
        options: ['It helped them grow crops', 'It made swimming fun', 'It washed their clothes'],
        correctAnswerIndex: 0
      }
    ]
  }
];
