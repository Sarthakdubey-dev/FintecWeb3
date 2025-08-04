export interface Block {
  id: string
  title: string
  type: "lesson" | "quiz"
  content?: string
  tips?: string[]
  questions?: QuizQuestion[]
  tokenReward: number
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface Course {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  totalTokens: number
  blocks: Block[]
  badge: string
}

export const courses: Course[] = [
  {
    id: "budgeting-101",
    title: "Budgeting 101",
    description: "Master the fundamentals of creating and maintaining a personal budget",
    difficulty: "Beginner",
    duration: "2 hours",
    totalTokens: 50,
    badge: "💰",
    blocks: [
      {
        id: "what-is-budgeting",
        title: "What is Budgeting?",
        type: "lesson",
        tokenReward: 5,
        content: `
# What is Budgeting?

A budget is a plan for how you'll spend your money over a specific period, typically a month. It helps you:

## Key Benefits
- **Track your spending** - Know where every dollar goes
- **Avoid debt** - Spend less than you earn
- **Save for goals** - Allocate money for future needs
- **Reduce stress** - Have control over your finances

## The Basic Formula
**Income - Expenses = Savings**

Your goal is to make sure this number is positive every month.

## Types of Expenses
1. **Fixed expenses** - Rent, insurance, loan payments
2. **Variable expenses** - Groceries, utilities, entertainment
3. **Discretionary expenses** - Dining out, hobbies, subscriptions
        `,
        tips: [
          "Start with tracking your current spending for a week",
          "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
          "Review and adjust your budget monthly",
          "Be realistic with your estimates",
        ],
      },
      {
        id: "budgeting-quiz",
        title: "Budgeting Knowledge Check",
        type: "quiz",
        tokenReward: 10,
        questions: [
          {
            id: "q1",
            question: "What is the basic budgeting formula?",
            options: [
              "Income + Expenses = Savings",
              "Income - Expenses = Savings",
              "Income × Expenses = Savings",
              "Income ÷ Expenses = Savings",
            ],
            correctAnswer: 1,
            explanation: "The basic formula is Income - Expenses = Savings. You want to spend less than you earn.",
          },
          {
            id: "q2",
            question: "Which expense type includes rent and insurance?",
            options: ["Variable expenses", "Discretionary expenses", "Fixed expenses", "Emergency expenses"],
            correctAnswer: 2,
            explanation: "Fixed expenses are costs that stay the same each month, like rent and insurance.",
          },
          {
            id: "q3",
            question: "What does the 50/30/20 rule suggest?",
            options: [
              "50% savings, 30% needs, 20% wants",
              "50% wants, 30% needs, 20% savings",
              "50% needs, 30% wants, 20% savings",
              "50% needs, 30% savings, 20% wants",
            ],
            correctAnswer: 2,
            explanation: "The 50/30/20 rule suggests 50% for needs, 30% for wants, and 20% for savings.",
          },
        ],
      },
      {
        id: "creating-your-budget",
        title: "Creating Your First Budget",
        type: "lesson",
        tokenReward: 8,
        content: `
# Creating Your First Budget

Now that you understand what budgeting is, let's create your first budget step by step.

## Step 1: Calculate Your Income
List all sources of money coming in:
- Salary (after taxes)
- Side hustle income
- Investment returns
- Any other regular income

## Step 2: List Your Expenses
### Fixed Expenses (Same every month)
- Rent/Mortgage
- Insurance premiums
- Loan payments
- Subscriptions

### Variable Expenses (Changes monthly)
- Groceries
- Utilities
- Gas
- Phone bill

### Discretionary Expenses (Optional)
- Entertainment
- Dining out
- Hobbies
- Shopping

## Step 3: Do the Math
Add up all expenses and subtract from income. If the result is negative, you need to cut expenses or increase income.

## Step 4: Allocate for Savings
Always pay yourself first! Set aside money for:
- Emergency fund
- Retirement
- Short-term goals
        `,
        tips: [
          "Use budgeting apps like Mint or YNAB to track automatically",
          "Round up expenses and round down income for safety",
          'Include a "miscellaneous" category for unexpected costs',
          "Start with a simple budget and add complexity later",
        ],
      },
    ],
  },
  {
    id: "saving-basics",
    title: "Saving Basics",
    description: "Learn effective strategies for building your savings and emergency fund",
    difficulty: "Beginner",
    duration: "1.5 hours",
    totalTokens: 40,
    badge: "🏦",
    blocks: [
      {
        id: "why-save",
        title: "Why Saving Matters",
        type: "lesson",
        tokenReward: 5,
        content: `
# Why Saving Matters

Saving money is one of the most important financial habits you can develop. Here's why:

## Financial Security
- **Emergency fund** - Cover unexpected expenses
- **Peace of mind** - Reduce financial stress
- **Opportunities** - Take advantage of good deals or investments

## Goal Achievement
- **Short-term goals** - Vacation, new car, home down payment
- **Long-term goals** - Retirement, children's education
- **Dreams** - Starting a business, traveling the world

## The Power of Compound Interest
When you save and invest, your money grows over time. The earlier you start, the more time your money has to compound.

**Example:** Saving $100/month starting at age 25 vs 35
- Start at 25: $347,000 by age 65
- Start at 35: $175,000 by age 65

That's a $172,000 difference just from starting 10 years earlier!
        `,
        tips: [
          "Start saving even if it's just $10 per month",
          "Automate your savings to make it effortless",
          "Save windfalls like tax refunds and bonuses",
          "Track your progress to stay motivated",
        ],
      },
      {
        id: "saving-quiz",
        title: "Saving Knowledge Check",
        type: "quiz",
        tokenReward: 10,
        questions: [
          {
            id: "q1",
            question: "What is compound interest?",
            options: [
              "Interest paid only on the principal amount",
              "Interest paid on both principal and previously earned interest",
              "A type of bank account",
              "A savings goal",
            ],
            correctAnswer: 1,
            explanation:
              "Compound interest is when you earn interest on both your original money and previously earned interest.",
          },
          {
            id: "q2",
            question: "How much should you ideally have in an emergency fund?",
            options: ["1 month of expenses", "3-6 months of expenses", "1 year of expenses", "2 weeks of expenses"],
            correctAnswer: 1,
            explanation: "Financial experts recommend 3-6 months of expenses in an emergency fund.",
          },
        ],
      },
    ],
  },
  {
    id: "investment-fundamentals",
    title: "Investment Fundamentals",
    description: "Understand the basics of investing in stocks, bonds, and other assets",
    difficulty: "Intermediate",
    duration: "3 hours",
    totalTokens: 75,
    badge: "📈",
    blocks: [
      {
        id: "what-is-investing",
        title: "What is Investing?",
        type: "lesson",
        tokenReward: 8,
        content: `
# What is Investing?

Investing is putting your money to work to generate more money over time. Unlike saving, investing involves some risk but offers the potential for higher returns.

## Key Investment Concepts

### Risk vs Return
- **Higher risk** = Potential for higher returns
- **Lower risk** = More stable but lower returns
- **Diversification** = Spreading risk across different investments

### Time Horizon
- **Short-term** (< 5 years) = Conservative investments
- **Long-term** (> 10 years) = Can take more risk for higher returns

### Asset Classes
1. **Stocks** - Ownership in companies
2. **Bonds** - Loans to companies or governments
3. **Real Estate** - Property investments
4. **Commodities** - Gold, oil, agricultural products

## The Magic of Time
Starting early is the most powerful investment strategy. A 25-year-old investing $200/month until retirement will have more money than a 35-year-old investing $400/month!
        `,
        tips: [
          "Start investing as early as possible",
          "Don't try to time the market",
          "Diversify your investments",
          "Keep costs low with index funds",
        ],
      },
    ],
  },
]

export function getCourse(id: string): Course | undefined {
  return courses.find((course) => course.id === id)
}

export function getBlock(courseId: string, blockId: string): Block | undefined {
  const course = getCourse(courseId)
  return course?.blocks.find((block) => block.id === blockId)
}
