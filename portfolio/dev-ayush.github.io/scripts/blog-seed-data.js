// Sample blog data for seeding the database
const existingBlogs = [
  {
    title: 'Getting Started with React and TypeScript',
    content: `<h2>Introduction</h2>
<p>React and TypeScript make a powerful combination for building robust web applications. In this comprehensive guide, we'll explore how to set up a new React project with TypeScript and implement best practices for type safety.</p>

<h3>Why TypeScript with React?</h3>
<p>TypeScript brings static type checking to JavaScript, which helps catch errors early in development and provides better tooling support. When combined with React, it offers:</p>
<ul>
<li>Better IntelliSense and autocomplete</li>
<li>Compile-time error checking</li>
<li>Improved refactoring capabilities</li>
<li>Enhanced code documentation</li>
</ul>

<h3>Setting Up the Project</h3>
<p>To create a new React TypeScript project, you can use Create React App with the TypeScript template:</p>
<pre><code>npx create-react-app my-app --template typescript</code></pre>

<h3>Key TypeScript Concepts for React</h3>
<p>When working with React and TypeScript, here are some important concepts to understand:</p>

<h4>Component Props Typing</h4>
<p>Always define interfaces for your component props:</p>
<pre><code>interface ButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {title}
    </button>
  );
};</code></pre>

<h4>State Typing</h4>
<p>Use generics to type your state when using useState:</p>
<pre><code>const [user, setUser] = useState<User | null>(null);</code></pre>

<h3>Best Practices</h3>
<ol>
<li>Always define prop interfaces</li>
<li>Use strict TypeScript configuration</li>
<li>Leverage union types for component variations</li>
<li>Use generics for reusable components</li>
<li>Enable ESLint with TypeScript rules</li>
</ol>

<h3>Conclusion</h3>
<p>React with TypeScript provides a solid foundation for building scalable web applications. The initial setup might seem complex, but the benefits in terms of code quality and developer experience are substantial.</p>`,
    excerpt: 'Learn how to set up a new React project with TypeScript and best practices for type safety.',
    slug: 'getting-started-with-react-and-typescript',
    tags: ['React', 'TypeScript', 'Web Development', 'JavaScript'],
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    published: true,
    featured: true,
    readTime: 8
  },
  {
    title: 'Mastering Tailwind CSS for Modern Web Design',
    content: `<h2>Introduction to Tailwind CSS</h2>
<p>Tailwind CSS has revolutionized the way we build user interfaces. This utility-first CSS framework provides low-level utility classes that let you build completely custom designs without ever leaving your HTML.</p>

<h3>Why Choose Tailwind CSS?</h3>
<p>Unlike traditional CSS frameworks, Tailwind doesn't impose design decisions on you. Instead, it provides the building blocks you need:</p>
<ul>
<li>Utility-first approach for maximum flexibility</li>
<li>Responsive design made easy</li>
<li>Built-in design system</li>
<li>Excellent performance with purge CSS</li>
<li>Extensive customization options</li>
</ul>

<h3>Getting Started</h3>
<p>Install Tailwind CSS in your project:</p>
<pre><code>npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p</code></pre>

<h3>Core Concepts</h3>

<h4>Utility Classes</h4>
<p>Tailwind provides utilities for almost every CSS property:</p>
<pre><code>&lt;!-- Padding, margin, colors --&gt;
&lt;div class="p-4 m-2 bg-blue-500 text-white rounded-lg"&gt;
  Beautiful card design
&lt;/div&gt;</code></pre>

<h4>Responsive Design</h4>
<p>All utilities can be applied conditionally at different breakpoints:</p>
<pre><code>&lt;img class="w-16 md:w-32 lg:w-48" src="..." alt="..." /&gt;</code></pre>

<h3>Conclusion</h3>
<p>Tailwind CSS offers unparalleled flexibility and efficiency in web design. Once you master its utility-first approach, you'll find yourself building better UIs faster than ever before.</p>`,
    excerpt: 'A comprehensive guide to using Tailwind CSS for rapid UI development and modern web design.',
    slug: 'mastering-tailwind-css',
    tags: ['CSS', 'Tailwind', 'Frontend', 'Web Design', 'UI/UX'],
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    published: true,
    featured: true,
    readTime: 12
  },
  {
    title: 'Building Responsive Web Applications: A Complete Guide',
    content: `<h2>The Importance of Responsive Design</h2>
<p>Responsive design is no longer optional in today's multi-device world. With users accessing websites from smartphones, tablets, laptops, and desktop computers, your application must provide an optimal experience across all screen sizes.</p>

<h3>Mobile-First Approach</h3>
<p>Start designing for the smallest screen first, then progressively enhance for larger screens:</p>
<ul>
<li>Easier to scale up than scale down</li>
<li>Forces focus on essential content</li>
<li>Better performance on mobile devices</li>
<li>Follows progressive enhancement principles</li>
</ul>

<h3>CSS Grid and Flexbox</h3>

<h4>Flexbox for Components</h4>
<p>Perfect for one-dimensional layouts:</p>
<pre><code>.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}</code></pre>

<h4>CSS Grid for Layouts</h4>
<p>Ideal for two-dimensional layouts:</p>
<pre><code>.main-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .main-layout {
    grid-template-columns: 250px 1fr;
  }
}</code></pre>

<h3>Conclusion</h3>
<p>Responsive web design is essential for creating inclusive web experiences. By following mobile-first principles and leveraging modern CSS techniques, you can build applications that work beautifully across all devices and screen sizes.</p>`,
    excerpt: 'Learn the principles of responsive design and how to implement them in your projects.',
    slug: 'building-responsive-web-applications',
    tags: ['Responsive Design', 'Web Development', 'CSS', 'Mobile-First', 'UI/UX'],
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80',
    published: true,
    featured: false,
    readTime: 15
  },
  {
    title: 'AI and Machine Learning in Web Development: A Practical Guide',
    content: `<h2>AI in Modern Web Development</h2>
<p>Artificial Intelligence and Machine Learning are transforming web development. From chatbots to recommendation systems, AI is becoming an integral part of modern web applications.</p>

<h3>Common AI Applications in Web Development</h3>

<h4>1. Chatbots and Virtual Assistants</h4>
<p>Implement intelligent chatbots using frameworks like:</p>
<ul>
<li>Dialogflow</li>
<li>Microsoft Bot Framework</li>
<li>Rasa</li>
<li>OpenAI GPT API</li>
</ul>

<h4>2. Recommendation Systems</h4>
<p>Personalize user experience with ML-powered recommendations:</p>
<pre><code>// Simple collaborative filtering
function getRecommendations(userId, userRatings, allRatings) {
  // Find similar users
  const similarUsers = findSimilarUsers(userId, allRatings);
  
  // Recommend items liked by similar users
  return generateRecommendations(similarUsers, userRatings);
}</code></pre>

<h3>Getting Started with AI APIs</h3>

<h4>OpenAI API Integration</h4>
<pre><code>import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateText(prompt) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
  });
  
  return completion.choices[0].message.content;
}</code></pre>

<h3>Conclusion</h3>
<p>AI and ML are becoming essential tools for web developers. Start with simple implementations and gradually build more sophisticated features as you gain experience. The key is to focus on solving real user problems rather than using AI for its own sake.</p>`,
    excerpt: 'Discover how to integrate AI and Machine Learning into your web applications with practical examples and best practices.',
    slug: 'ai-machine-learning-web-development-guide',
    tags: ['AI', 'Machine Learning', 'Web Development', 'JavaScript', 'TensorFlow', 'OpenAI'],
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    published: true,
    featured: true,
    readTime: 18
  }
];

module.exports = { existingBlogs };