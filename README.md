# influpost

**Upload once, publish everywhere.** A modern cross-platform video scheduling tool for content creators.

influpost lets you upload a video file, preview exactly how it will appear on YouTube, Instagram, and TikTok, and schedule posts to all three platforms simultaneously. Quality, sound, hashtags, format, location tags, and all metadata are preserved exactly as uploaded.

---

## Features

### Video Upload & Storage
- Drag-and-drop video upload with progress tracking
- Supports MP4, MOV, AVI, MKV, and WebM formats (up to 500MB)
- Videos stored securely in Firebase Storage
- Original quality and audio preserved — no re-encoding

### Platform Previews
- **YouTube Preview** — See your video in a realistic YouTube player with title, description, channel info, like/subscribe buttons, and hashtags
- **Instagram Preview** — View your Reel as it appears in the Instagram feed with username, caption, hashtags, location tag, and engagement icons
- **TikTok Preview** — Full phone-style TikTok preview with overlay UI, profile info, captions, hashtags, location, and sound info

### Post Scheduling
- Schedule posts to any combination of YouTube, Instagram, and TikTok
- Set exact date and time for each post
- View all scheduled posts in a grouped list (Today, Tomorrow, This Week, Later)
- Filter by status: scheduled, publishing, published, failed
- Delete scheduled posts before they publish

### Metadata Control
- **Title** — Set the video title (used on YouTube)
- **Description** — Full post description/caption for all platforms
- **Hashtags** — Add unlimited hashtags with tag-style input (Enter or comma to add)
- **Location Tags** — Add a location that appears on Instagram and TikTok
- **Privacy** — Choose public, unlisted, or private
- **Category** — Set the video category (e.g., Entertainment, Education)

### Account Management
- Connect YouTube, Instagram, and TikTok accounts via OAuth 2.0
- View all connected accounts with connection date
- Disconnect accounts at any time
- Secure token-based authentication — passwords are never stored

### Dashboard
- Overview of all scheduled and published posts
- Stats: scheduled count, published count, connected accounts, total posts
- Quick-access upcoming posts list
- Connected accounts summary

### Authentication
- Email/password sign-up and sign-in
- Google OAuth sign-in
- Protected routes — redirects to login when not authenticated
- User profiles stored in Firestore

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Backend** | [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage) |
| **State** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Icons** | [React Icons](https://react-icons.github.io/react-icons/) |
| **Notifications** | [React Hot Toast](https://react-hot-toast.com/) |
| **File Upload** | [React Dropzone](https://react-dropzone.js.org/) |
| **Dates** | [date-fns](https://date-fns.org/) |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Firebase project with Authentication, Firestore, and Storage enabled

### 1. Clone the Repository

```bash
git clone https://github.com/seboliver16/influpost.git
cd influpost
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

You can find these values in your [Firebase Console](https://console.firebase.google.com/) under **Project Settings > General > Your apps > Firebase SDK snippet**.

### 4. Set Up Firebase Services

In your Firebase Console:

1. **Authentication** — Enable Email/Password and Google sign-in providers
2. **Firestore Database** — Create a database in production mode. Set up the following security rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /scheduledPosts/{postId} {
         allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
         allow create: if request.auth != null;
       }
       match /connectedAccounts/{accountId} {
         allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
         allow create: if request.auth != null;
       }
     }
   }
   ```
3. **Storage** — Enable Firebase Storage with the following rules:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /videos/{userId}/{allPaths=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 6. Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
influpost/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── accounts/           # Connected accounts management
│   │   ├── dashboard/          # Main dashboard
│   │   ├── login/              # Login page
│   │   ├── schedule/           # Scheduled posts view
│   │   ├── signup/             # Signup page
│   │   ├── upload/             # Upload & schedule page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── providers.tsx       # Auth & toast providers
│   ├── components/
│   │   ├── layout/             # Sidebar, AppLayout
│   │   ├── previews/           # YouTube, Instagram, TikTok previews
│   │   ├── ui/                 # Button, Input, Badge
│   │   ├── PlatformSelector.tsx
│   │   ├── PostForm.tsx
│   │   └── VideoUploader.tsx
│   ├── hooks/
│   │   └── useAuth.tsx         # Auth context & hook
│   ├── lib/
│   │   └── firebase.ts         # Firebase initialization
│   ├── store/
│   │   └── useStore.ts         # Zustand global store
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── .env.local.example          # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

---

## Firestore Data Model

### `users` Collection
```typescript
{
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  connectedAccounts: ConnectedAccount[];
  createdAt: Timestamp;
}
```

### `scheduledPosts` Collection
```typescript
{
  videoId: string;
  videoUrl: string;
  videoFileName: string;
  thumbnailUrl?: string;
  metadata: {
    title: string;
    description: string;
    hashtags: string[];
    locationTag?: string;
    privacy: "public" | "private" | "unlisted";
    category?: string;
  };
  platforms: ("youtube" | "instagram" | "tiktok")[];
  accountIds: string[];
  scheduledFor: Timestamp;
  status: "scheduled" | "publishing" | "published" | "failed";
  publishResults?: {
    platform: string;
    status: "success" | "failed";
    postUrl?: string;
    error?: string;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
}
```

### `connectedAccounts` Collection
```typescript
{
  platform: "youtube" | "instagram" | "tiktok";
  username: string;
  displayName: string;
  avatarUrl: string;
  accessToken: string;
  refreshToken?: string;
  connectedAt: Timestamp;
  userId: string;
}
```

---

## Platform API Integration

The app is structured to support real OAuth integration with each platform's API:

| Platform | API | Docs |
|----------|-----|------|
| YouTube | YouTube Data API v3 | [developers.google.com/youtube](https://developers.google.com/youtube/v3) |
| Instagram | Instagram Graph API | [developers.facebook.com/docs/instagram-api](https://developers.facebook.com/docs/instagram-api/) |
| TikTok | TikTok Content Posting API | [developers.tiktok.com](https://developers.tiktok.com/) |

Currently, the account connection flow simulates OAuth for demonstration. To enable real publishing:

1. Register your app with each platform's developer program
2. Implement the OAuth 2.0 redirect flow in `/api/auth/[platform]/callback`
3. Store the real access/refresh tokens in Firestore
4. Create a Firebase Cloud Function or server-side endpoint that runs on schedule to publish posts using the platform APIs

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase init hosting
npm run build
firebase deploy --only hosting
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

Built with Next.js, Firebase, and Tailwind CSS.
