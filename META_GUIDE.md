# 🎯 Meta Tier List - Complete Guide

## ✅ What's Been Created

### 📁 File Structure
```
src/
├── app/
│   ├── api/meta/
│   │   ├── route.ts              # GET, POST, DELETE tier data
│   │   └── batch/route.ts        # Batch updates
│   ├── meta/
│   │   └── page.tsx             # 🌐 Public tier list page
│   └── admin/meta/
│       └── page.tsx             # 🔒 Admin drag-and-drop interface
├── components/
│   └── meta/
│       └── MetaTierList.tsx     # Tier list display component
└── prisma/
    ├── schema.prisma            # Database schema
    └── dev.db                   # SQLite database
```

## 🚀 How to Use

### 1. Public Meta Page (`/meta`)

**URL**: `http://localhost:3000/meta`

Features:
- ✨ Beautiful tier list display matching the reference design
- 🎨 Color-coded tiers (S, A, B, C, D, F)
- 🖱️ Clickable brawler icons (navigate to brawler pages)
- 💡 Hover tooltips showing brawler names
- 📱 Fully responsive (mobile & desktop)

### 2. Admin Page (`/admin/meta`)

**URL**: `http://localhost:3000/admin/meta`

Features:
- 🎯 Drag-and-drop brawlers between tiers
- ↕️ Reorder brawlers within the same tier
- 💾 Save changes to SQLite database
- 👀 View available (unranked) brawlers
- 🔄 Real-time updates

**How to Use the Admin Page:**

1. **Move Between Tiers**: Drag a brawler from one tier to another
2. **Reorder Within Tier**: Drag to reposition brawlers in the same tier
3. **Save Changes**: Click "Save Changes" button (top right)
4. **Success**: Toast notification confirms save

### 3. Navigation

The "Meta" link has been added to your navbar:
- Home | Favorites | Brawlers | **Meta** | Maps | Events

## 🎨 Tier Colors (Matching Reference)

```
S: Red (#f66)       - Best in meta
A: Orange (#f96)    - Strong picks
B: Yellow (#fc6)    - Solid choices
C: Lime (#cf6)      - Average
D: Green (#6c6)     - Below average
F: Green (#6fc)     - Needs buffs
```

## 🗄️ Database Structure

**Table**: `BrawlerTier`
```sql
CREATE TABLE BrawlerTier (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brawlerId INTEGER UNIQUE NOT NULL,
    tier TEXT NOT NULL,           -- 'S', 'A', 'B', 'C', 'D', 'F'
    position INTEGER NOT NULL,     -- Order within tier (0, 1, 2...)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Location**: `prisma/dev.db` (SQLite file)

## 🔌 API Endpoints

### Get All Tier Data
```http
GET /api/meta
```

Response:
```json
[
  {
    "id": 1,
    "brawlerId": 16000000,
    "tier": "S",
    "position": 0,
    "createdAt": "2025-12-23T...",
    "updatedAt": "2025-12-23T..."
  }
]
```

### Update Single Brawler
```http
POST /api/meta
Content-Type: application/json

{
  "brawlerId": 16000000,
  "tier": "A",
  "position": 2
}
```

### Batch Update (Used by Admin)
```http
POST /api/meta/batch
Content-Type: application/json

{
  "updates": [
    { "brawlerId": 16000000, "tier": "S", "position": 0 },
    { "brawlerId": 16000001, "tier": "S", "position": 1 }
  ]
}
```

### Remove Brawler from Tier List
```http
DELETE /api/meta
Content-Type: application/json

{
  "brawlerId": 16000000
}
```

## 🔒 Securing the Admin Page

### Option 1: Simple Password (Quick Setup)

Create `src/middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for admin cookie or header
  const adminToken = request.cookies.get('admin-token')?.value;

  if (adminToken !== process.env.ADMIN_SECRET) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

Add to `.env`:
```
ADMIN_SECRET=your-secret-password-here
```

### Option 2: Basic Auth (Better Security)

Update `src/middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
    });
  }

  const [username, password] = Buffer.from(
    authHeader.split(' ')[1],
    'base64'
  ).toString().split(':');

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return new NextResponse('Invalid credentials', { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

Add to `.env`:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

### Option 3: NextAuth.js (Production Ready)

For production, implement proper authentication:
```bash
npm install next-auth
```

See: https://next-auth.js.org/

## 🎮 Quick Start Workflow

1. **Start Dev Server**
   ```bash
   npm run dev
   ```

2. **Open Admin Page**
   - Go to `http://localhost:3000/admin/meta`

3. **Organize Brawlers**
   - Drag brawlers from "Available Brawlers" section
   - Drop them into desired tiers
   - Reorder as needed

4. **Save Changes**
   - Click "Save Changes" button
   - Check public page: `http://localhost:3000/meta`

## 📝 Example: Populating Initial Data

You can populate the database programmatically:

```typescript
// scripts/populate-meta.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // S-Tier brawlers
  const sTier = [16000000, 16000001, 16000002]; // Shelly, Colt, Bull IDs

  for (let i = 0; i < sTier.length; i++) {
    await prisma.brawlerTier.upsert({
      where: { brawlerId: sTier[i] },
      update: { tier: 'S', position: i },
      create: { brawlerId: sTier[i], tier: 'S', position: i }
    });
  }

  console.log('Meta tier list populated!');
}

main();
```

Run:
```bash
npx tsx scripts/populate-meta.ts
```

## 🐛 Troubleshooting

### Database doesn't exist
```bash
npx prisma db push
```

### Prisma Client not generated
```bash
npx prisma generate
```

### Changes not saving
- Check browser console for errors
- Verify API routes are working: `curl http://localhost:3000/api/meta`
- Check database file exists: `ls prisma/dev.db`

### Drag and drop not working
- Ensure `@dnd-kit` packages are installed
- Check browser console for React errors
- Try refreshing the page

## 🎯 Next Steps

1. **Secure the admin page** (see security options above)
2. **Populate initial tier data** using the admin interface
3. **Test the public page** to ensure it displays correctly
4. **Add authentication** before deploying to production
5. **Backup your database** regularly (`prisma/dev.db`)

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [dnd-kit Documentation](https://docs.dndkit.com/)
- [Reference Site](https://mmonster.co/blog/brawl-stars-meta)

---

**Created**: December 23, 2024
**Database**: SQLite via Prisma
**Framework**: Next.js 14+
