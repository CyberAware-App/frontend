# CyberAware - Developer's Guide

This guide provides detailed information about the CyberAware frontend codebase structure, design patterns, styling approach, and component usage to help developers understand and contribute to the project effectively.

## 📁 Codebase Structure

The CyberAware frontend follows a modern Next.js App Router structure with a clear separation of concerns:

```
├── app/                          # Next.js App Router (routes)
│   ├── (home)/                   # Landing page route group
│   │   └── page.tsx              # Home page component
│   ├── auth/                     # Authentication routes
│   │   ├── signin/               # Login page
│   │   ├── signup/               # Registration page
│   │   ├── reset-password/       # Password reset flow
│   │   └── verify-account/       # Account verification
│   ├── dashboard/                # User dashboard
│   │   └── page.tsx              # Dashboard page component
│   ├── -components/              # App-specific shared components
│   │   ├── BaseLayout.tsx        # Base layout wrapper
│   │   ├── Main.tsx              # Main content wrapper
│   │   └── index.ts              # Component exports
│   ├── layout.tsx                # Root layout (applies to all routes)
│   └── Providers.tsx             # App-wide providers (React Query, etc.)
├── components/                   # Reusable UI components
│   ├── common/                   # Utility components
│   │   ├── for.ts                # List rendering utility
│   │   ├── NavLink.tsx           # Navigation link component
│   │   ├── slot.ts               # Component composition utility
│   │   └── teleport.ts           # DOM node teleportation utility
│   ├── icons/                    # SVG icon components
│   └── ui/                       # UI component library
│       ├── button.tsx            # Button component
│       ├── progress.tsx          # Progress bar component
│       └── [other UI components]
├── lib/                          # Utility functions
│   └── utils/
│       └── cn.ts                 # Tailwind class utilities
├── public/                       # Static assets
│   └── assets/                   # Images and media files
└── tailwind.css                  # Global styles and theme definitions
```

## 🧩 Design Patterns & Coding Conventions

### Component Architecture

The project follows a component-based architecture with several key patterns:

1. **Route-Based Organization**: Pages are organized by routes in the `app` directory following Next.js App Router conventions.

2. **Component Hierarchy**:
   - **Layout Components**: `BaseLayout` and `Main` provide consistent structure
   - **UI Components**: Reusable UI elements in `components/ui`
   - **Common Utilities**: Helper components in `components/common`

3. **Component Props Pattern**:
   - Uses TypeScript for type safety
   - Leverages utility types like `InferProps` for prop inheritance
   - Implements polymorphic components where needed (e.g., Button)

```tsx
// Example of component props pattern
function Component(props: InferProps<"element">) {
  const { children, className, ...restOfProps } = props;

  return (
    <element
      className={cnMerge("base-classes", className)}
      {...restOfProps}
    >
      {children}
    </element>
  );
}
```

### State Management

1. **React Query**: Used for server state management and data fetching
   - Configured with default stale time of 1 minute
   - Includes React Query DevTools for development

2. **Form Management**:
   - Uses React Hook Form with Zod validation
   - Leverages `@zayne-labs/ui-react/ui/form` components

### Styling Approach

1. **Tailwind CSS**: Utility-first CSS approach
   - Custom utility functions: `cnMerge`, `cnJoin`, and `tw` template literal
   - Component-specific styles using Tailwind Variants (`tv`)

2. **Class Naming Conventions**:
   - Uses descriptive class names
   - Follows mobile-first responsive design
   - Leverages Tailwind's utility classes for styling

```tsx
// Example of styling pattern with cnMerge
<div className={cnMerge("flex min-h-svh w-full flex-col items-center", className)}>
  {children}
</div>
```

## 🎨 Design Tokens & Theming

### Color Palette

CyberAware uses a custom color palette defined in `tailwind.css`:

```css
@theme {
  --color-cyberaware-aeces-blue: hsl(238, 80%, 8%);
  --color-cyberaware-unizik-orange: hsl(27, 100%, 56%);
  --color-cyberaware-light-orange: hsl(27, 65%, 93%);
  --color-cyberaware-neutral-gray-light: hsl(0, 0%, 82%);
  --color-cyberaware-neutral-gray-lighter: hsl(0, 0%, 96%);
  --color-cyberaware-body-color: hsl(0, 0%, 29%);
}
```

These colors are used throughout the application for:
- **AECES Blue**: Primary brand color, used for headings and important UI elements
- **Unizik Orange**: Secondary brand color, used for buttons and accents
- **Light Orange**: Used for backgrounds and subtle highlights
- **Neutral Grays**: Used for text, borders, and background variations

### Typography

The application uses the Work Sans font family:

```css
@theme inline {
  --font-work-sans: var(--font-work-sans);
}
```

Font weights used:
- 400 (Regular)
- 500 (Medium)
- 600 (Semibold)
- 700 (Bold)

### Breakpoints

Responsive breakpoints are defined as:

```css
--breakpoint-sm: 480px;
--breakpoint-md: 780px;
--breakpoint-lg: 1000px;
--breakpoint-xl: 1280px;
```

The application follows a mobile-first approach, with the main content constrained to a maximum width of 430px:

```tsx
<main className="relative flex w-full max-w-[430px] grow flex-col">
```

### Animations

Custom animations are defined for various UI interactions:

```css
--animate-nav-show: nav-show 350ms ease forwards;
--animate-nav-close: nav-close 500ms ease forwards;
--animate-fade-in: fade-in 300ms ease forwards;
--animate-fade-out: fade-out 300ms ease forwards;
--animate-sidebar-in: sidebar-in 250ms ease;
--animate-sidebar-out: sidebar-out 250ms ease;
```

## 🔘 Button Component

The Button component is a key UI element with multiple variants and features.

### Usage

```tsx
// Basic usage
<Button>Click Me</Button>

// With theme variant
<Button theme="orange">Primary Action</Button>
<Button theme="white">Secondary Action</Button>
<Button theme="blue-ghost">Tertiary Action</Button>

// Loading state
<Button isLoading={true}>Processing</Button>

// As link (with NavLink)
<Button asChild={true}>
  <NavLink href="/path">Navigate</NavLink>
</Button>

// Disabled state
<Button disabled={true}>Unavailable</Button>
```

### Props

The Button component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'orange' \| 'white' \| 'blue-ghost'` | `'orange'` | Button visual style |
| `isLoading` | `boolean` | `false` | Shows loading spinner when true |
| `asChild` | `boolean` | `false` | Passes props to child component |
| `unstyled` | `boolean` | `false` | Removes default styling |
| `disabled` | `boolean` | `false` | Disables the button |
| `className` | `string` | - | Additional CSS classes |

### Variants

1. **Orange (Default)**
   - Background: Unizik Orange (`bg-cyberaware-unizik-orange`)
   - Text: White (`text-white`)
   - Used for primary actions and call-to-actions

2. **White**
   - Background: White (`bg-white`)
   - Text: AECES Blue (`text-cyberaware-aeces-blue`)
   - Used for actions on colored backgrounds

3. **Blue Ghost**
   - Border: 2px AECES Blue (`border-2 border-cyberaware-aeces-blue`)
   - Background: Transparent (`bg-transparent`)
   - Used for secondary actions

### Implementation Details

The Button component uses Tailwind Variants (`tv`) for styling:

```tsx
const buttonVariants = tv({
  base: "flex h-[52px] w-full min-w-fit items-center justify-center p-3.5 text-base font-medium",

  variants: {
    theme: {
      orange: "bg-cyberaware-unizik-orange text-white",
      white: "bg-white text-cyberaware-aeces-blue",
      "blue-ghost": "border-2 border-cyberaware-aeces-blue bg-transparent",
    },
    isLoading: {
      true: "grid",
    },
    disabled: {
      true: "cursor-not-allowed",
    },
    isDisabled: {
      true: "",
    },
  },

  defaultVariants: {
    theme: "orange",
  },
});
```

The component also handles loading states by showing a spinner while preserving the button's dimensions to prevent layout shifts:

```tsx
const withIcon = (
  <>
    <Slot.Slottable>
      <div className="invisible [grid-area:1/1]">{children}</div>
    </Slot.Slottable>

    <span className="flex justify-center [grid-area:1/1]">
      <SpinnerIcon />
    </span>
  </>
);
```

## 📝 Form Handling

Forms are implemented using React Hook Form with Zod validation:

```tsx
const SignupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

function SignupPage() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = form.handleSubmit((data) => console.info({ data }));

  return (
    <Form.Root methods={form} className="gap-6" onSubmit={(event) => void onSubmit(event)}>
      <Form.Field control={form.control} name="name">
        <Form.Label>Full name</Form.Label>
        <Form.Input placeholder="Enter full name" />
        <Form.ErrorMessage />
      </Form.Field>
      {/* Additional form fields */}
      <Form.Submit asChild={true}>
        <Button>Submit</Button>
      </Form.Submit>
    </Form.Root>
  );
}
```

## 🧠 Best Practices

1. **Component Organization**
   - Keep components focused on a single responsibility
   - Use composition over inheritance
   - Extract reusable logic into custom hooks

2. **Styling**
   - Use Tailwind utility classes for styling
   - Leverage the custom utility functions (`cnMerge`, `cnJoin`) for class composition
   - Follow the established color palette and design tokens

3. **State Management**
   - Use React Query for server state
   - Keep component state minimal and focused
   - Leverage React's built-in hooks for local state

4. **Performance**
   - Use Next.js App Router features for code splitting
   - Optimize images using Next.js Image component
   - Implement proper memoization where needed

5. **Accessibility**
   - Ensure proper semantic HTML
   - Include appropriate ARIA attributes
   - Test with keyboard navigation

## 🔄 Development Workflow

1. **Starting Development**
   ```bash
   pnpm dev
   ```

2. **Code Quality**
   ```bash
   # Run ESLint
   pnpm lint:eslint

   # Format code with Prettier
   pnpm lint:format

   # Type checking
   pnpm lint:type-check
   ```

3. **Building for Production**
   ```bash
   pnpm build
   pnpm start
   ```

## 🧪 Testing

The project uses manual testing for UI components and functionality. Future improvements could include:

- Unit tests with Jest/React Testing Library
- Integration tests for key user flows
- End-to-end tests with Cypress or Playwright

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)