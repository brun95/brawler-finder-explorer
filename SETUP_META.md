# Meta Tier List Setup Guide

## Installation Steps

### 1. Install Required Dependencies

```bash
npm install @prisma/client prisma @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 2. Initialize Prisma

```bash
npx prisma generate
npx prisma db push
```

This will create the SQLite database and the `BrawlerTier` table.

### 3. Update Navigation (Optional)

Add the Meta link to your navigation bar in `src/components/NavBar.tsx`:

```tsx
<Link href="/meta" className="text-gray-700 hover:text-primary transition-colors">
  Meta
</Link>
```

## Usage

### Public Meta Page
- **URL**: `/meta`
- Users can view the current tier list
- Click on brawlers to go to their detail pages

### Admin Page
- **URL**: `/admin/meta`
- Drag and drop brawlers between tiers
- Reorder brawlers within tiers
- Click "Save Changes" to persist to database

### API Endpoints

#### Get Tier Data
```
GET /api/meta
```
Returns all tier data ordered by tier and position.

#### Update Single Brawler
```
POST /api/meta
Body: { brawlerId: number, tier: string, position: number }
```

#### Batch Update
```
POST /api/meta/batch
Body: { updates: Array<{ brawlerId, tier, position }> }
```

#### Remove Brawler
```
DELETE /api/meta
Body: { brawlerId: number }
```

## Database Schema

The `BrawlerTier` table structure:
- `id`: Auto-increment primary key
- `brawlerId`: Unique brawler ID (from Brawl Stars API)
- `tier`: String (S, A, B, C, D, F)
- `position`: Integer (for ordering within tier)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## Security Recommendations

### Protect Admin Route

Add authentication middleware to protect `/admin/meta`:

1. Create `src/middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Simple password protection
  const authHeader = request.headers.get('authorization');

  if (!authHeader || authHeader !== 'Bearer YOUR_SECRET_TOKEN') {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

2. Or use environment variables for password:

```typescript
if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
  // Unauthorized
}
```

3. Add to `.env.local`:
```
ADMIN_SECRET=your-super-secret-password-here
```

### Better Security (Recommended)

For production, consider using:
- **NextAuth.js** for proper authentication
- **Role-based access control** (RBAC)
- **IP whitelisting** for admin routes

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── meta/
│   │       ├── route.ts          # CRUD operations
│   │       └── batch/
│   │           └── route.ts      # Batch updates
│   ├── meta/
│   │   └── page.tsx             # Public tier list page
│   └── admin/
│       └── meta/
│           └── page.tsx         # Admin drag-and-drop interface
├── components/
│   └── meta/
│       └── MetaTierList.tsx     # Tier list display component
└── prisma/
    ├── schema.prisma            # Database schema
    └── dev.db                   # SQLite database (created after push)
```

## Customization

### Change Tier Colors

Edit `TIER_CONFIG` in:
- `src/components/meta/MetaTierList.tsx`
- `src/app/admin/meta/page.tsx`

### Add More Tiers

Add new tiers to `TIER_CONFIG` objects and update the schema if needed.

### Mobile Responsiveness

The tier list is responsive and works on mobile devices with touch support for drag-and-drop.
