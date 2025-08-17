# CyberAware - Developer's Guide

Welcome to the CyberAware development guide! This document will help you understand and work with the CyberAware frontend codebase, whether you're a beginner or experienced developer.

## 🚀 Quick Start

New to the project? Start here:

1. **Read the [README.md](./README.md)** for project overview and setup
2. **Explore the [Project Structure](#-project-structure)** to understand the codebase
3. **Learn about [Key Technologies](#-key-technologies)** we use
4. **Check out [Common Tasks](#-common-development-tasks)** for everyday development

## 📚 What You'll Learn

- How the project is organized and why
- Key technologies and how we use them
- Design system and styling approach
- API integration patterns
- Component usage and best practices
- Common development workflows

## 📁 Project Structure

The CyberAware project is organized to make it easy to find and work with different parts of the application. Here's how everything is structured:

```
├── app/                          # Next.js App Router (routes)
│   ├── (home)/                   # Landing page route group
│   │   └── page.tsx              # Home page component
│   ├── (protected)/              # Protected routes requiring authentication
│   │   ├── dashboard/            # User dashboard
│   │   └── -components/          # Protected route components
│   │       └── ProtectedMain.tsx # Protected main wrapper with session check
│   ├── auth/                     # Authentication routes
│   │   ├── signin/               # Login page
│   │   ├── signup/               # Registration page
│   │   ├── forgot-password/      # Password recovery flow
│   │   ├── reset-password/       # Password reset flow
│   │   └── verify-account/       # Account verification
│   ├── -components/              # App-specific shared components
│   │   ├── BaseLayout.tsx        # Base layout wrapper
│   │   ├── Main.tsx              # Main content wrapper
│   │   ├── Credits.tsx           # Institution credits component
│   │   └── index.ts              # Component exports
│   ├── layout.tsx                # Root layout (applies to all routes)
│   └── Providers.tsx             # App-wide providers (React Query, etc.)
├── components/                   # Reusable UI components
│   ├── common/                   # Utility components
│   │   ├── for.ts                # List rendering utility
│   │   ├── NavLink.tsx           # Navigation link component
│   │   ├── slot.ts               # Component composition utility
│   │   ├── teleport.ts           # DOM node teleportation utility
│   │   └── Toaster.tsx           # Toast notification component
│   ├── icons/                    # SVG icon components
│   └── ui/                       # UI component library
│       ├── button.tsx            # Button component
│       ├── progress.tsx          # Progress bar component
│       └── [other UI components]
├── lib/                          # Utility functions
│   ├── api/                      # Backend API integration
│   │   └── callBackendApi/       # API client with plugins
│   │       ├── apiSchema.ts      # API schema definitions
│   │       ├── callBackendApi.ts # Main API client
│   │       └── plugins/          # API plugins (auth, toast, etc.)
│   ├── react-query/              # React Query configuration
│   │   ├── queryClient.ts        # Query client setup
│   │   └── queryOptions.ts       # Predefined query options
│   ├── utils/
│   │   └── cn.ts                 # Tailwind class utilities
│   └── zustand/                  # State management
│       └── themeStore.ts         # Theme state management
├── public/                       # Static assets
│   └── assets/                   # Images and media files
└── tailwind.css                  # Global styles and theme definitions
```

## 🔧 Key Technologies

Understanding these technologies will help you work effectively with the codebase:

### Frontend Framework
- **Next.js 15.4.6** - React framework with file-based routing
- **React 19.1.1** - UI library for building components
- **TypeScript** - Adds type safety to JavaScript

### Styling
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Custom Design System** - Consistent colors, fonts, and components

### State Management
- **React Query** - Manages server data (API calls, caching)
- **Zustand** - Manages client data (theme, user preferences)
- **React Hook Form** - Handles form validation and submission

### API Integration
- **CallAPI** - Type-safe HTTP client for backend communication
- **Zod** - Schema validation for API requests and responses

## 🏗️ How Components Work

### Component Structure
Components in this project follow a consistent pattern:

```tsx
// 1. Import dependencies
import { cnMerge } from "@/lib/utils/cn";

// 2. Define component with TypeScript types
function MyComponent(props: { title: string; className?: string }) {
  const { title, className } = props;

  // 3. Return JSX with Tailwind classes
  return (
    <div className={cnMerge("base-styles", className)}>
      <h1>{title}</h1>
    </div>
  );
}
```

### Component Types
- **Layout Components** (`app/-components/`): Structure the page layout
- **UI Components** (`components/ui/`): Reusable buttons, forms, etc.
- **Common Components** (`components/common/`): Shared utilities and helpers

### Styling Pattern
We use Tailwind CSS with helper functions:

```tsx
// cnMerge combines classes and handles conflicts
className={cnMerge("default-styles", "override-styles", props.className)}

// cnJoin simply joins classes without conflict resolution
className={cnJoin("class1", "class2")}
```

## 🎨 Design System

### Colors
The app uses a consistent color palette. Here are the main colors you'll work with:

| Color | Usage | Tailwind Class |
|-------|-------|----------------|
| **AECES Blue** | Primary brand color, headings | `text-cyberaware-aeces-blue` |
| **AECES Blue Light** | Secondary elements | `bg-cyberaware-aeces-blue-light` |
| **Unizik Orange** | Buttons, accents | `bg-cyberaware-unizik-orange` |
| **Light Orange** | Backgrounds | `bg-cyberaware-light-orange` |
| **Gray Light** | Borders, subtle text | `text-cyberaware-neutral-gray-light` |

### Typography
- **Font**: Work Sans (defined in `app/layout.tsx`)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Responsive Design
The app is mobile-first with these breakpoints:
- **sm**: 480px and up
- **md**: 780px and up
- **lg**: 1000px and up
- **xl**: 1280px and up

### Custom Utilities
- **`custom-scrollbar`**: Branded scrollbars for scrollable content
- **`cnMerge()`**: Combines Tailwind classes intelligently
- **`cnJoin()`**: Simple class joining without conflict resolution

## 🔘 Button Component Guide

The Button component is your go-to for all clickable actions. Here's how to use it effectively:

### Quick Examples

```tsx
// Most common usage - primary action button
<Button>Save Changes</Button>

// Different styles for different purposes
<Button theme="orange">Primary Action</Button>      // Main actions (default)
<Button theme="white">Secondary Action</Button>     // Actions on colored backgrounds
<Button theme="blue-ghost">Cancel</Button>          // Secondary/cancel actions
<Button theme="blue-light">Alternative</Button>     // Alternative primary actions

// Interactive states
<Button isLoading={true}>Saving...</Button>         // Shows spinner
<Button disabled={true}>Can't Click</Button>        // Grayed out

// As a link (looks like button, acts like link)
<Button asChild>
  <NavLink href="/dashboard">Go to Dashboard</NavLink>
</Button>
```

### When to Use Each Style

| Style | When to Use | Example |
|-------|-------------|---------|
| **Orange** (default) | Primary actions, CTAs | "Sign Up", "Save", "Submit" |
| **White** | Actions on dark backgrounds | Buttons on blue/orange sections |
| **Blue Ghost** | Secondary actions | "Cancel", "Skip", "Learn More" |
| **Blue Light** | Alternative primary actions | Special features, highlights |

### Common Patterns

**Form Submit Button:**
```tsx
<Button
  type="submit"
  isLoading={form.formState.isSubmitting}
  isDisabled={!form.formState.isValid}
>
  {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
</Button>
```

**Navigation Button:**
```tsx
<Button asChild>
  <NavLink href="/next-page">Continue</NavLink>
</Button>
```

**Conditional Button:**
```tsx
<Button
  theme={isPrimary ? "orange" : "blue-ghost"}
  disabled={!canProceed}
>
  {buttonText}
</Button>
```

## 🔐 Authentication & Protected Routes

The application implements a robust authentication system with protected routes:

### Protected Route Pattern

Protected routes use the `(protected)` route group with a custom `ProtectedMain` component:

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { sessionQuery } from "@/lib/react-query/queryOptions";
import { Main } from "@/app/-components";

function ProtectedMain(props: InferProps<typeof Main>) {
  const { data } = useQuery(sessionQuery());

  if (data) {
    return <Main {...props} />;
  }

  return null;
}
```

### Session Management

Session management is handled through React Query with automatic refresh:

```tsx
export const sessionQuery = () => {
  return queryOptions({
    queryFn: () => checkAndRefreshUserSession(),
    queryKey: ["session"],
    refetchInterval: 9 * 60 * 1000, // 9 minutes
    retry: false,
    staleTime: Infinity,
  });
};
```

## 🎨 Theme Management

The application supports dark/light theme switching with system preference detection:

### Theme Store

```tsx
type ThemeStore = {
  actions: {
    initThemeOnLoad: () => void;
    setTheme: (newTheme: "dark" | "light") => void;
    toggleTheme: () => void;
  };
  isDarkMode: boolean;
  systemTheme: "dark" | "light";
  theme: "dark" | "light" | "system";
};
```

### Usage

```tsx
import { useThemeStore } from "@/lib/zustand/themeStore";

function ThemeToggle() {
  const { theme, actions } = useThemeStore();

  return (
    <button onClick={actions.toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

## 🔔 Toast Notifications

Toast notifications are integrated with the API client and theme system:

```tsx
import { SonnerToaster } from "@/components/common/Toaster";

function App() {
  return (
    <>
      {/* Your app content */}
      <SonnerToaster />
    </>
  );
}
```

The toaster automatically adapts to the current theme and provides rich notifications for API responses.

## 🌐 API Integration

### What is CallAPI?

We use **CallAPI** ([docs](https://zayne-labs-callapi.netlify.app/)) for all backend communication. Think of it as a smart way to talk to our server that:

- ✅ **Validates data** before sending and after receiving
- ✅ **Provides type safety** so you know what data to expect
- ✅ **Handles errors** automatically with user-friendly messages
- ✅ **Manages authentication** tokens behind the scenes

### Why CallAPI?

Instead of writing repetitive fetch code and validation, CallAPI lets us:
1. Define our API once with schemas
2. Get automatic TypeScript types
3. Handle errors consistently
4. Reuse validation between forms and API calls

### How It's Organized

```
lib/api/callBackendApi/
├── apiSchema.ts              # 📋 All API endpoints and their data shapes
├── callBackendApi.ts         # 🔧 Configured API clients
├── index.ts                  # 📤 What gets exported
└── plugins/                  # 🔌 Extra features
    ├── authHeaderInclusionPlugin.ts  # 🔐 Adds auth tokens automatically
    ├── toastPlugin.ts               # 🔔 Shows success/error messages
    └── utils/                       # 🛠️ Helper functions
        └── refreshUserSession.ts    # 🔄 Keeps you logged in
```

### API Schema - The Heart of Type Safety

The API schema (`lib/api/callBackendApi/apiSchema.ts`) defines every endpoint our app can call. This ensures:
- **Consistent data shapes** between frontend and backend
- **Automatic validation** of requests and responses
- **TypeScript types** generated automatically

#### Understanding Endpoint Definitions

Each endpoint is defined with a specific pattern. Here's how to read them:

```tsx
export const apiSchema = defineSchema({
  "@post/register": {
    body: z.object({
      email: z.email(),
      first_name: z.string().min(3, "First name must be at least 3 characters long"),
      last_name: z.string().min(3, "Last name must be at least 3 characters long"),
      password: z.string().min(8, "Password must be at least 8 characters long"),
    }),
    data: withBaseSuccessResponse(z.object({
      email: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      otp_sent: z.boolean(),
    })),
    errorData: withBaseErrorResponse(z.object({
      email: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      password: z.string(),
    }).partial()),
  },

  "/dashboard": {
    data: withBaseSuccessResponse(z.object({
      completed_modules: z.int().nonnegative(),
      modules: z.array(z.object({
        description: z.string(),
        file_url: z.url(),
        id: z.number(),
        module_type: z.string(),
        name: z.string(),
      })),
      percentage_completed: z.number().min(0).max(100),
      total_modules: z.int().nonnegative(),
    })),
  },
  // ... other endpoints
}, { strict: true }); // Only allow defined routes
```

### API Client Configuration

The application provides two configured clients optimized for different use cases:

```tsx
const sharedBaseCallApiConfig = defineBaseConfig((instanceCtx) => ({
  baseURL: BASE_API_URL,
  dedupeCacheScope: "global", // Prevent duplicate requests
  dedupeCacheScopeKey: BASE_API_URL,
  plugins: [authHeaderInclusionPlugin(), toastPlugin()],
  schema: apiSchema,
  skipAutoMergeFor: "options",
  meta: {
    toast: {
      endpointsToSkip: {
        errorAndSuccess: ["/token-refresh"],
        success: ["/session"],
      },
      error: true,
      success: true,
    },
  },
}));

// Standard client for mutations with full error handling
export const callBackendApi = createFetchClient(sharedBaseCallApiConfig);

// React Query optimized client - throws errors and returns only data
export const callBackendApiForQuery = createFetchClient((instanceCtx) => ({
  ...sharedBaseCallApiConfig(instanceCtx),
  resultMode: "onlySuccessWithException", // Returns just data, not { data, error }
  throwOnError: true, // React Query expects thrown errors
}));
```

### Plugin System

#### Authentication Plugin

Automatically handles JWT token management:

```tsx
export const authHeaderInclusionPlugin = definePlugin(() => ({
  hooks: {
    onRequest: (ctx) => {
      // Automatically adds access token to requests
      // Skips auth for public routes like /auth/signin
      const accessToken = localStorage.getItem("accessToken");
      ctx.options.auth = accessToken;
    },
    onResponseError: async (ctx) => {
      // Automatically refreshes tokens on 401 errors
      if (ctx.response.status === 401 && isAuthTokenRelatedError(ctx.error)) {
        await refreshUserSession();
        ctx.options.retryAttempts = 1; // Retry the request
      }
    },
  },
}));
```

#### Toast Plugin

Provides automatic user feedback:

```tsx
export const toastPlugin = definePlugin(() => ({
  hooks: {
    onSuccess: (ctx) => {
      // Shows success toast unless endpoint is in skip list
      toast.success(ctx.data.message);
    },
    onError: (ctx) => {
      // Shows error toasts for validation errors
      if (ctx.error.errorData.errors) {
        for (const message of Object.values(ctx.error.errorData.errors)) {
          toast.error(message);
        }
      }
    },
  },
}));
```

### Usage Patterns

#### Basic API Call

```tsx
import { callBackendApi } from "@/lib/api/callBackendApi";

// CallAPI returns { data, error } by default
const result = await callBackendApi("@post/register", {
  body: {
    email: "user@example.com",
    first_name: "John",
    last_name: "Doe",
    password: "securepassword123",
  },
});

// Type-safe access to response data
if (result.data) {
  console.log(result.data.data.otp_sent); // boolean - fully typed
  console.log(result.data.message); // string - success message
}

if (result.error) {
  console.log(result.error.errorData.errors); // Validation errors if any
}
```

#### Form Integration with Error Handling

```tsx
const handleSubmit = async (formData: RegisterFormData) => {
  const result = await callBackendApi("@post/register", {
    body: formData,
    onResponseError: (ctx) => {
      // Automatically map validation errors to form fields
      if (ctx.error.errorData?.errors) {
        for (const [key, value] of Object.entries(ctx.error.errorData.errors)) {
          form.setError(key as keyof RegisterFormData, { message: value });
        }
      }
    },
    onSuccess: (ctx) => {
      // Handle successful registration
      router.push("/auth/verify-account");
    },
  });
};
```

#### React Query Integration

CallAPI is optimized for React Query integration. The `callBackendApiForQuery` client is configured to work seamlessly with React Query's expectations:

```tsx
export const dashboardQuery = () => {
  return queryOptions({
    queryFn: () => callBackendApiForQuery("/dashboard", {
      meta: { toast: { success: false } } // Skip success toast for queries
    }),
    queryKey: ["dashboard"],
    staleTime: Infinity,
  });
};

// Usage in component
function Dashboard() {
  const { data, error, isLoading } = useQuery(dashboardQuery());

  // data is fully typed based on schema definition
  if (data) {
    console.log(data.completed_modules); // number
    console.log(data.percentage_completed); // number (0-100)
  }

  return <div>{/* Dashboard content */}</div>;
}
```

### Session Management

Automatic session refresh is handled transparently using CallAPI's deduplication and error handling features:

```tsx
const refreshUserSession = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    const message = "Session is missing! Redirecting to login...";
    toast.error(message);
    setTimeout(() => hardNavigate("/auth/signin"), 1500);
    throw new Error(message);
  }

  const result = await callBackendApi("@post/token-refresh", {
    body: { refresh: refreshToken },
    dedupeStrategy: "defer", // Prevent duplicate refresh requests
    meta: {
      skipAuthHeaderAddition: true, // Don't add access token to this request
    },
  });

  if (isHTTPError(result.error)) {
    const message = "Session invalid or expired! Redirecting to login...";
    toast.error(message);
    setTimeout(() => hardNavigate("/auth/signin"), 1500);
    throw new Error(message);
  }

  // Update access token in localStorage
  result.data?.data && localStorage.setItem("accessToken", result.data.data.access);
};
```

### Type Safety Benefits

The schema-first approach provides:

- **Compile-time type checking** for request/response data
- **Runtime validation** with Zod schemas
- **IntelliSense support** for all API endpoints
- **Automatic error type inference** for proper error handling

### Configuration

Environment-based API URL configuration:

```tsx
const BACKEND_HOST =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000"
    : "https://cyberaware-api-mx7u.onrender.com";

const BASE_API_URL = `${BACKEND_HOST}/api`;
```

### CallAPI Features & Benefits

#### Core Features

1. **Schema-First Development**: All API endpoints are defined with Zod schemas, ensuring type safety and runtime validation
2. **Plugin Architecture**: Cross-cutting concerns like authentication and notifications are handled declaratively through plugins
3. **Request Deduplication**: Built-in deduplication prevents duplicate API calls using `dedupeCacheScope`
4. **Multiple Result Modes**:
   - Default: Returns `{ data, error }` object
   - `onlySuccessWithException`: Returns only data, throws errors (perfect for React Query)
5. **Flexible Configuration**: Per-instance and per-request configuration options
6. **Built on Fetch API**: Modern, native browser API with full streaming support

#### Schema Validation Features

- **Request Validation**: Validates `body`, `headers`, `query`, `params` before sending
- **Response Validation**: Validates both success `data` and `errorData` responses
- **Custom Validators**: Support for custom validation functions alongside Zod schemas
- **Method Enforcement**: HTTP method validation using `@method/path` syntax or method schema
- **Strict Mode**: Optional strict mode to only allow defined routes

#### Advanced Features

- **Dynamic Path Parameters**: Support for `:param` syntax with validation
- **Environment-based Configuration**: Easy switching between development and production APIs
- **Error Handling Utilities**: Built-in error type checking with `isHTTPError`, `isValidationError`
- **TypeScript Integration**: Full type inference from schemas with IntelliSense support

#### Development Experience

1. **Type Safety**: Compile-time type checking for all API calls and responses
2. **Runtime Validation**: Automatic validation of requests and responses
3. **Error Handling**: Structured error handling with detailed validation messages
4. **Plugin System**: Extensible architecture for adding custom functionality
5. **React Query Integration**: Optimized configuration for React Query usage patterns

### Validation Error Handling

CallAPI provides comprehensive error handling with specific error types:

```tsx
import { isHTTPError, isValidationError } from "@zayne-labs/callapi/utils";

const result = await callBackendApi("@post/register", {
  body: { /* invalid data */ },
});

if (result.error) {
  if (isHTTPError(result.error)) {
    // HTTP errors (4xx, 5xx responses)
    console.log(result.error.status); // HTTP status code
    console.log(result.error.errorData); // Validated error response
  }

  if (isValidationError(result.error)) {
    // Schema validation errors
    console.log(result.error.issues); // Detailed validation issues
  }
}
```

### Base Response Schemas

The application uses consistent base response schemas for all API endpoints:

```tsx
const BaseSuccessResponseSchema = z.object({
  data: z.record(z.string(), z.unknown()),
  message: z.string(),
  status: z.literal("success"),
});

const BaseErrorResponseSchema = z.object({
  errors: z.record(z.string(), z.string()).nullable(),
  message: z.string(),
  status: z.literal("error"),
});

// Helper functions for consistent response structure
const withBaseSuccessResponse = <TSchemaObject extends z.ZodType>(dataSchema: TSchemaObject) =>
  z.object({
    ...BaseSuccessResponseSchema.shape,
    data: dataSchema,
  });

const withBaseErrorResponse = <TSchemaObject extends z.ZodType = typeof BaseErrorResponseSchema.shape.errors>(
  errorSchema?: TSchemaObject
) =>
  z.object({
    ...BaseErrorResponseSchema.shape,
    errors: (errorSchema ?? BaseErrorResponseSchema.shape.errors) as NonNullable<TSchemaObject>,
  });
```

## 🛠️ Common Development Tasks

### Adding a New Page

1. **Create the page file** in the appropriate `app/` directory:
   ```tsx
   // app/my-new-page/page.tsx
   function MyNewPage() {
     return <div>My new page content</div>;
   }
   export default MyNewPage;
   ```

2. **Add navigation** if needed:
   ```tsx
   <NavLink href="/my-new-page">Go to My Page</NavLink>
   ```

### Creating a New Component

1. **Create the component file** in `components/ui/` or `components/common/`:
   ```tsx
   // components/ui/my-component.tsx
   import { cnMerge } from "@/lib/utils/cn";

   type MyComponentProps = {
     title: string;
     className?: string;
   };

   export function MyComponent({ title, className }: MyComponentProps) {
     return (
       <div className={cnMerge("base-styles", className)}>
         <h2>{title}</h2>
       </div>
     );
   }
   ```

2. **Export it** from the appropriate index file:
   ```tsx
   // components/ui/index.ts
   export { MyComponent } from "./my-component";
   ```

### Making API Calls

1. **For simple data fetching** (like dashboard data):
   ```tsx
   import { useQuery } from "@tanstack/react-query";
   import { dashboardQuery } from "@/lib/react-query/queryOptions";

   function Dashboard() {
     const { data, isLoading, error } = useQuery(dashboardQuery());

     if (isLoading) return <div>Loading...</div>;
     if (error) return <div>Error loading data</div>;

     return <div>Dashboard data: {data.completed_modules}</div>;
   }
   ```

2. **For form submissions** (like registration):
   ```tsx
   import { callBackendApi } from "@/lib/api/callBackendApi";

   const handleSubmit = async (formData) => {
     await callBackendApi("@post/register", {
       body: formData,
       onSuccess: () => {
         // Handle success
         router.push("/success-page");
       },
       onResponseError: (ctx) => {
         // Handle validation errors
         console.error(ctx.error.errorData.errors);
       },
     });
   };
   ```

### Working with Forms

1. **Reuse API schemas** for validation:
   ```tsx
   import { apiSchema } from "@/lib/api/callBackendApi";

   // Use the same validation as the API
   const FormSchema = apiSchema.routes["@post/register"].body;
   ```

2. **Set up the form**:
   ```tsx
   const form = useForm({
     resolver: zodResolver(FormSchema),
     defaultValues: { email: "", first_name: "", last_name: "", password: "" },
   });
   ```

### Styling Components

1. **Use existing design tokens**:
   ```tsx
   <div className="bg-cyberaware-unizik-orange text-white p-4">
     Orange button style
   </div>
   ```

2. **Combine classes safely**:
   ```tsx
   import { cnMerge } from "@/lib/utils/cn";

   <div className={cnMerge("base-styles", "additional-styles", props.className)}>
     Content
   </div>
   ```

### Debugging Tips

1. **Check the browser console** for errors and warnings
2. **Use React Query DevTools** to inspect API calls and cache
3. **Check the Network tab** to see actual HTTP requests
4. **Use TypeScript errors** as guidance - they usually point to the issue

## 📚 Learning Resources

- **CallAPI Documentation**: [https://zayne-labs-callapi.netlify.app/](https://zayne-labs-callapi.netlify.app/)
- **Next.js App Router**: [https://nextjs.org/docs/app](https://nextjs.org/docs/app)
- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **React Query**: [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
- **React Hook Form**: [https://react-hook-form.com/](https://react-hook-form.com/)

This architecture ensures that backend integration is robust, type-safe, and maintainable while providing excellent developer experience and runtime safety.

## 📝 Form Handling

Forms are implemented using React Hook Form with schema reuse from CallAPI routes. This ensures consistency between client-side validation and API expectations:

```tsx
import { apiSchema, callBackendApi } from "@/lib/api/callBackendApi";

// Reuse the exact schema from the API route definition
const SignupSchema = apiSchema.routes["@post/register"].body;

function SignupPage() {
  const form = useForm({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
    },
    mode: "onTouched",
    resolver: zodResolver(SignupSchema), // Uses the same validation as the API
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <Form.Root
      methods={form}
      className="gap-6"
      onSubmit={(event) =>
        void form.handleSubmit(async (data) => {
          await callBackendApi("@post/register", {
            body: data, // Data is already validated by the form

            onResponseError: (ctx) => {
              // Map API validation errors back to form fields
              for (const [key, value] of Object.entries(ctx.error.errorData.errors)) {
                form.setError(key as never, { message: value });
              }
            },

            onSuccess: (ctx) => {
              // Handle successful registration
              localStorage.setItem("email", data.email);

              // Update React Query cache
              queryClient.setQueryData(sessionQuery().queryKey, (oldData) => ({
                ...(oldData as NonNullable<typeof oldData>),
                data: {
                  ...(oldData?.data as NonNullable<typeof oldData>["data"]),
                  ...pickKeys(ctx.data.data, ["email", "first_name", "last_name"]),
                },
              }));

              router.push("/auth/verify-account");
            },
          });
        })(event)
      }
    >
      <Form.Field control={form.control} name="first_name">
        <Form.Label className="text-white">First name</Form.Label>
        <Form.Input placeholder="Enter first name" />
        <Form.ErrorMessage />
      </Form.Field>

      <Form.Field control={form.control} name="last_name">
        <Form.Label className="text-white">Last name</Form.Label>
        <Form.Input placeholder="Enter last name" />
        <Form.ErrorMessage />
      </Form.Field>

      <Form.Field control={form.control} name="email">
        <Form.Label className="text-white">Email address</Form.Label>
        <Form.Input placeholder="Enter email address" />
        <Form.ErrorMessage />
      </Form.Field>

      <Form.Field control={form.control} name="password">
        <Form.Label className="text-white">Password</Form.Label>
        <Form.Input type="password" placeholder="Enter password" />
        <Form.ErrorMessage />
      </Form.Field>

      <Form.Submit asChild={true}>
        <Button
          isLoading={form.formState.isSubmitting}
          isDisabled={form.formState.isSubmitting}
        >
          Create Account
        </Button>
      </Form.Submit>
    </Form.Root>
  );
}
```

### Schema Reuse Benefits

This pattern provides several key advantages:

1. **Single Source of Truth**: The API schema defines validation rules once
2. **Consistency**: Client and server validation are always in sync
3. **Type Safety**: Form data types are automatically inferred from the API schema
4. **Maintainability**: Changes to API validation automatically update form validation
5. **Error Mapping**: API validation errors can be directly mapped to form fields

## ✅ Best Practices

### 🎯 Component Guidelines
- **Keep it simple**: One component, one purpose
- **Reuse schemas**: Use API schemas for form validation
- **Use TypeScript**: Let types guide you to correct usage
- **Follow naming**: Use descriptive names for components and props

### 🎨 Styling Guidelines
- **Use design tokens**: Stick to the defined color palette
- **Mobile-first**: Design for mobile, enhance for desktop
- **Use `cnMerge()`**: For combining Tailwind classes safely
- **Consistent spacing**: Follow the existing spacing patterns

### 🔄 State Management
- **Server data**: Use React Query for API calls and caching
- **Client data**: Use Zustand for app-wide state (like theme)
- **Form data**: Use React Hook Form with schema validation
- **Local state**: Use `useState` for component-specific data

### 🔐 Security & Auth
- **Protected routes**: Use the `(protected)` route group for auth-required pages
- **Let plugins handle auth**: Don't manually add auth headers
- **Handle errors gracefully**: Show user-friendly error messages
- **Validate everything**: Trust the schema validation

### 🚀 Performance Tips
- **Use React Query**: It handles caching and background updates
- **Optimize images**: Use Next.js `Image` component
- **Lazy load**: Only load what's needed when it's needed
- **Monitor bundle size**: Keep dependencies reasonable

### 🎯 User Experience
- **Show loading states**: Users should know something is happening
- **Handle errors well**: Clear, actionable error messages
- **Use toast notifications**: For success/error feedback
- **Test on mobile**: Most users will be on mobile devices

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
