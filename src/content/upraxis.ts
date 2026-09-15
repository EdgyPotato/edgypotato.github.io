import type { Project } from './types'
export default {
 slug: 'upraxis', title: 'Upraxis', category: 'Web application', status: 'In active development', placement: 'featured', order: 1,
 summary: 'A productivity app that turns daily tasks into quests with experience points and rewards. Task management, focus sessions, habits, and goals sit together in one workspace.',
 technologies: ['C# / .NET', 'React', 'PostgreSQL', 'EF Core', 'TypeScript'],
 contribution: 'Building the React interface and .NET backend, including authentication, database access, and reward handling. AI assisted development includes reviewing generated code, debugging, and checking changes against the application requirements.',
 sections: [
 { title: 'FocusQuest: turning tasks into progress', body: 'FocusQuest handles individual tasks as quests. Each quest has a category, difficulty, and optional subtasks. Completing a quest records experience points, with streaks and achievements tracking progress over time. Focus mode provides timed work and break sessions alongside the task workflow.' },
 { title: 'BuildPath: goals and daily habits', body: 'BuildPath connects longer term goals with repeatable habits. Goal cards bring habit logging and learning entries together, so progress includes both completed actions and notes from practice. Personal rewards provide another reason to keep working toward a goal.' },
 { title: 'Keeping completion and rewards consistent', body: 'Completing a quest changes task status and reward balances together. The API checks account ownership, rejects an already completed quest, and compares the submitted version with the stored record. A PostgreSQL transaction and account row lock coordinate competing requests, preventing two simultaneous completions from awarding the same quest twice.' },
 { title: 'Testing the difficult cases', body: 'Backend test cases check experience and coin records, streak creation, achievements, and completion timestamps. Repeated completion requests are expected to return a conflict. Separate PostgreSQL tests submit completion requests concurrently and check that rewards are recorded only once. Frontend tests cover the quest list and completion workflow.' }
 ],
 limitations: 'Upraxis remains in active development. The application source is private, and a public demo is not available.',
 visual: { title: 'Application boundaries', image: 'projects/upraxis.png', card: 'projects/upraxis-card.webp', alt: 'Upraxis FocusQuest interface showing sample quests and progress', width: 1440, height: 960, caption: 'Application screenshot with sample data' }
} satisfies Project
