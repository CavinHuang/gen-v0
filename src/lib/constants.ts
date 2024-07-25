export const EXAMPLES = [
	'Make me a flashy landing page for an AI SaaS startup. Come up with an exciting name and create a navigation bar up top.',
	'Create a responsive navigation bar with dropdown menus, using a dark theme.',
	'I need a user profile card with an avatar, name, and social media links in Tailwind CSS.',
	'Generate a modal popup for user feedback, including text area and submit button.',
	'Can you make a pricing table with three tiers, highlighting the best value tier?',
	'Build a responsive image gallery grid that supports lightbox viewing.',
	"I'm looking for a login form with email and password fields, plus a remember me checkbox.",
	'Design a newsletter signup section with an input field and a subscribe button, featuring a minimalist aesthetic.',
	'Create a footer with columns for links, a brief about section, and social media icons.',
	'Generate a dashboard layout with a sidebar navigation, header, and content area.',
	'I need an accordion FAQ section where questions expand to show answers on click.',
	'Produce a blog post template with a featured image, title, date, author, and content area.',
	'Design a to-do list app interface with tasks, checkboxes, and an add task form.',
	'Create a progress bar component that shows percentage completion and can be styled dynamically.',
	'Generate a contact form with name, email, message fields, and a send button, with validation styles.',
	'Design a carousel slider for featured articles with previous and next controls, using a sleek, modern look.',
	'Create a set of social share buttons with icons for Facebook, Twitter, LinkedIn, and Instagram, with a hover effect.',
	'Generate a responsive table with sortable columns, row highlight on hover, and pagination.',
	"I need a card layout for product listings, including an image, title, price, and 'Add to Cart' button.",
	"Build a timeline component for displaying a project's milestones, with vertical lines and circular markers.",
	'Design a weather widget showing the current temperature, weather condition icons, and a 5-day forecast.',
	'Create an alert component with success, warning, and error variations that can be dismissed.',
	'Generate a multi-step form for a checkout process, including progress indicators.',
	"I'm looking for a tab component with horizontal navigation and dynamically loaded content.",
	'Design a search bar with autocomplete suggestions that appear as the user types.',
	'Create a sticky header that becomes visible when scrolling up and hides on scrolling down.',
	'Generate a set of animated loading spinners with different styles for asynchronous data loading.',
	'I need a grid of cards for team members, including photo, name, role, and a short bio, with a flip effect on hover.',
	'Build a testimonial slider with quotes from customers, including their names and photos.',
	'Design a date picker component that integrates with a form and supports range selection.',
	'Generate a set of badges for different status levels like New, In Progress, and Completed, with customizable colors.'
] satisfies string[]

export const adjectives = [
	'creative',
	'colorful',
	'enterprise',
	'modern',
	'minimal',
	'weirder'
] satisfies string[]

export const knownImageModels = [
	/^gpt-/,
	/^llava/,
	/^moondream/,
	/^gemini-1\.5/,
	/^claude/,
	/^phi-3-vision/
] satisfies RegExp[]


export const defaultSystemPrompt = `
🎉 Greetings, TailwindCSS Virtuoso! 🌟

You've mastered the art of frontend design and TailwindCSS! Your mission is to transform detailed descriptions or compelling images into stunning HTML using the versatility of TailwindCSS. Ensure your creations are seamless in both dark and light modes! Your designs should be responsive and adaptable across all devices – be it desktop, tablet, or mobile.

*Design Guidelines:*
- Utilize placehold.co for placeholder images and descriptive alt text.
- For interactive elements, leverage modern ES6 JavaScript and native browser APIs for enhanced functionality.
- Inspired by shadcn, we provide the following colors which handle both light and dark mode:

\`\`\`css
  --background
  --foreground
  --primary
	--border
  --input
  --ring
  --primary-foreground
  --secondary
  --secondary-foreground
  --accent
  --accent-foreground
  --destructive
  --destructive-foreground
  --muted
  --muted-foreground
  --card
  --card-foreground
  --popover
  --popover-foreground
\`\`\`

Prefer using these colors when appropriate, for example:

\`\`\`html
<button class="bg-secondary text-secondary-foreground hover:bg-secondary/80">Click me</button>
<span class="text-muted-foreground">This is muted text</span>
\`\`\`

*Implementation Rules:*
- Only implement elements within the \`<body>\` tag, don't bother with \`<html>\` or \`<head>\` tags.
- Avoid using SVGs directly. Instead, use the \`<img>\` tag with a descriptive title as the alt attribute and add .svg to the placehold.co url, for example:

\`\`\`html
<img aria-hidden="true" alt="magic-wand" src="/icons/24x24.svg?text=🪄" />
\`\`\`
`