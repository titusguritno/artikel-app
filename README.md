
## Haiii🤙, i'm Titus Guritno🧑

- [@titusguritno](https://github.com/titusguritno)

If you would like to find out more about this, please visit the demo page at https://artikel-app.vercel.app/
# 🔎Overview
Article management is an information system used to search and read articles. It also allows you to add, edit and delete articles in the system if you are logged in as an admin. In this information system you can be an article writer or just a reader. This system is made using the Next.js framework, the display uses shadcn which makes it even more attractive.

## 🚀Technologies
- ⚡ Next.js 14 – React framework for building modern web apps

- 🟦 TypeScript – Typed JavaScript for safer and scalable code

- 🎨 Tailwind CSS – Utility-first CSS framework

- 🧩 ShadCN UI – Reusable and accessible component library

- 🔗 Axios – HTTP client for API communication

-🎯 Lucide Icons – Beautiful and consistent icon set

-🧪 Zod + React Hook Form – Schema validation and form management
## 🖥️ Getting Started
1. Clone the project
```
git clone https://github.com/titusguritno/artikel-app.git
```

2. Install dependencies
```
npm install
```

3. Set up environment variables
```
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
```

4. Run the development server
```
npm run dev
```

5. Open in your browser
```
Navigate to http://localhost:3000
```

6. Install Tailwind CSS:
```
npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p
```

Update tailwind.config.ts :
```
content: [
  "./app/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./pages/**/*.{ts,tsx}"
],
```

7. Initialize ShadCN
```
npx shadcn-ui@latest init
```

8. Add components
```
npx shadcn@latest add [select the required]
```
9. Install Lucide Icons
```
npm install lucide-react
```
Usage :
```
import {LogOut} from "lucide-react";
```

10. Install Axios
```
npm install Axios
```
Create a file lib/axios.ts :
```
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export default api;
```

11. Install Zod + React Hook from
```
npm install zod react-hook-form @hookform/resolvers
```

## 📁 Folder Structure
```
artikel-app/
├── public/                     # Static assets (e.g. logos, background images)
│   └── assets/
│       ├── logoipsum2.svg
│       └── background.jpg

├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/
│   │   │   ├── category/       # Admin: Category management
│   │   │   ├── articles/       # Admin: Article management
│   │   │   │   ├── add/        # Add new article
│   │   │   │   ├── preview/    # Preview draft
│   │   │   │   └── [id]/       # Edit article by ID
│   │   ├── articles/           # Public article listing and detail
│   │   │   └── [id]/           # Article detail page
│   │   ├── login/              # Login page
│   │   ├── register/           # Register page
│   │   ├── profile/            # Profile page
│   │   └── page.tsx           # Landing or redirect logic

│   ├── components/
│   │   ├── ui/                 # ShadCN UI components
│   │   └── modals/            # Reusable modals (e.g. logout)

│   ├── lib/
│   │   └── axios.ts           # Axios instance with base config

│   └── styles/                # Global styles (optional)

├── .env.local                 # Environment variables
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── postcss.config.js         # PostCSS config
└── README.md
```

## 🧾Features
- 🔐 Login and token-based authentication

- 👤 Admin profile (view username, password, and role)

- 📄 CRUD for Articles

    - Add articles (with thumbnail upload directly to api/upload)

    - View article list
    
    - Preview before publishing

- 🏷️ Article category management

- 🧭 Dynamic sidebar & topbar layout

- 🎨 Responsive UI built with Tailwind CSS + ShadCN

- ⚠️ Form validation before submission

- 🔒 Logout with confirmation modal
## 🚧Implementation Guide
1. 🔐 Authentication
- Login via ```POST /api/auth/login``` using username & password.

- Token is stored in ```localStorage``` for authenticated API calls.

- Role-based redirection (e.g. Admin → ```/admin/articles```, User → ```/articles```).

2. 👤 Admin Profile
- Accessed via /profile.

- Displays:

    - ```username```
    - ```password```(retrivied from ```localstorage```)
    - ```role``` (from ```/api/auth/profile```)

3. 📄 Article Management (CRUD)
➕ Create Article
- Form with:

    - Title

    - Category (select)

    - Content (textarea)

    - Thumbnail (image file)

- Thumbnail uploaded directly to ```POST /api/upload``` → returns ```url```.

- Final article data sent to ```POST /api/articles.```

👁️ Preview Article
- Temporarily stored in ```sessionStorage```.

- Accessed via ```/admin/articles/preview.```

📋 List Articles
- Fetched from ```GET /api/articles?search=&category=&page=1&limit=9```

- Includes:

    - Responsive grid

    - Pagination (with ```shadcn/ui```)

    - Filter by category

    - Search debounce (```lodash```)

4. 🏷️ Category Management
- Add/view categories at ```/admin/category```.

- Uses ```GET``` and ```POST``` to ```api/categories```.

5. 🧭 Layout
- Sidebar:

    - Navigate between "Articles", "Category", and "Logout"

- Topbar:

    - Avatar (initial from username)

    - Dropdown for "Profile" and "Logout"

- Logout uses confirmation modal (```/components/modals/logout.tsx```)

6. ⚠️ Form Validation
- Using ```zod + react-hook-form```

- Inline validation messages

- Prevents upload if any field is missing
## Acknowledgements
🌐https://vercel.com/?utm_source=powered-by-vercel

