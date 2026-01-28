# SQLite to Neon PostgreSQL Migration Guide

This guide documents the migration of your portfolio database from SQLite to Neon PostgreSQL.

## Migration Status: ✅ DATA MIGRATED

### Completed Steps:

1. ✅ **Installed PostgreSQL client dependencies**
   - Installed `pg` and `@types/pg` packages
   - Installed `dotenv` for environment variable management

2. ✅ **Exported all SQLite data**
   - Created `scripts/export-sqlite-data.js`
   - Exported all data to `data/sqlite-export.json`
   - **Data Summary:**
     - Projects: 5
     - Skills: 26
     - Experiences: 2
     - Blogs: 4
     - Comments: 3
     - Testimonials: 5
     - Educations: 4
     - Personal Info: 1
     - Users: 2

3. ✅ **Created Neon Postgres connection**
   - Set up `.env` file with DATABASE_URL
   - Connection string: `postgresql://neondb_owner:npg_1braCAMqfgj9@ep-young-snow-ahiaojjp-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require`

4. ✅ **Created PostgreSQL schema**
   - Created `scripts/create-postgres-schema.js`
   - Successfully created all tables in Neon database
   - Tables created:
     - projects
     - skills
     - experiences
     - blogs
     - comments (with indexes)
     - testimonials
     - educations
     - personal_info
     - settings
     - users

5. ✅ **Imported all data to Neon Postgres**
   - Created `scripts/import-to-postgres.js`
   - Successfully imported all data
   - **Import Results: 100% Success**
     - Projects: 5/5
     - Skills: 26/26
     - Experiences: 2/2
     - Blogs: 4/4
     - Comments: 3/3
     - Testimonials: 5/5
     - Educations: 4/4
     - Personal Info: 1/1
     - Users: 2/2

### Remaining Steps:

6. ⏳ **Update database.ts to use PostgreSQL**
   - Created partial `src/lib/database-postgres.ts` with:
     - PostgreSQL connection pool
     - Project operations (complete)
     - Experience operations (complete)
     - Skill operations (complete)
   - **TO DO:** Complete remaining operations:
     - Blog operations
     - Comment operations
     - Testimonial operations
     - Education operations
     - Personal info operations
     - User operations

7. ⏳ **Replace old database.ts**
   - Backup created: `src/lib/database-sqlite-backup.ts`
   - Need to complete the new database.ts file

8. ⏳ **Test the migration**
   - Test all CRUD operations
   - Verify data integrity
   - Test the application end-to-end

## Key Differences Between SQLite and PostgreSQL

### 1. Connection Management
- **SQLite**: Single file-based connection
- **PostgreSQL**: Connection pool with multiple clients

### 2. Data Types
- **SQLite**: TEXT for JSON data, INTEGER for booleans
- **PostgreSQL**: JSONB for JSON data, BOOLEAN for booleans

### 3. Timestamps
- **SQLite**: `datetime('now')` returns TEXT
- **PostgreSQL**: `CURRENT_TIMESTAMP` returns TIMESTAMP

### 4. Query Syntax
- **SQLite**: Uses `?` placeholders
- **PostgreSQL**: Uses `$1`, `$2`, etc. placeholders

### 5. Case Sensitivity
- **SQLite**: `LIKE` is case-insensitive
- **PostgreSQL**: Use `ILIKE` for case-insensitive matching

## Database Operations Pattern

All database operations now follow this async/await pattern:

\`\`\`typescript
export const someOperations = {
  getAll: async (filters) => {
    const client = await getClient();
    try {
      // Query logic here
      const result = await client.query('SELECT ...', [params]);
      return result.rows;
    } finally {
      client.release();
    }
  }
};
\`\`\`

## Environment Variables

Make sure your `.env` file contains:

\`\`\`env
DATABASE_URL=postgresql://neondb_owner:npg_1braCAMqfgj9@ep-young-snow-ahiaojjp-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
NODE_ENV=development
\`\`\`

## Scripts Available

1. **Export SQLite data:**
   \`\`\`bash
   node scripts/export-sqlite-data.js
   \`\`\`

2. **Create PostgreSQL schema:**
   \`\`\`bash
   node scripts/create-postgres-schema.js
   \`\`\`

3. **Import data to PostgreSQL:**
   \`\`\`bash
   node scripts/import-to-postgres.js
   \`\`\`

## Next Steps

1. Complete the remaining database operations in `database-postgres.ts`
2. Copy the completed file to `database.ts`
3. Update package.json to remove `better-sqlite3` dependency
4. Test all admin panel features
5. Test all public portfolio features
6. Deploy to production

## Rollback Plan

If you need to rollback to SQLite:
1. Restore `src/lib/database-sqlite-backup.ts` to `src/lib/database.ts`
2. Change `.env` back to use SQLite (or remove DATABASE_URL)
3. Reinstall `better-sqlite3` if removed

## Files Created/Modified

### New Files:
- `.env` - Environment variables with Neon connection string
- `.env.example` - Template for environment variables
- `scripts/export-sqlite-data.js` - Export SQLite data to JSON
- `scripts/create-postgres-schema.js` - Create Postgres schema
- `scripts/import-to-postgres.js` - Import data to Postgres
- `src/lib/database-postgres.ts` - New Postgres database module (partial)
- `data/sqlite-export.json` - Exported SQLite data
- `MIGRATION_GUIDE.md` - This file

### Modified Files:
- `package.json` - Added pg, @types/pg, dotenv
- `src/lib/database.ts` - To be replaced

### Backup Files:
- `src/lib/database-sqlite-backup.ts` - Original SQLite database module
- `data/portfolio.db` - Original SQLite database (keep for now)

## Notes

- The Neon database is already populated with all your data
- The PostgreSQL schema matches your SQLite schema
- All JSONB columns can be queried efficiently
- Connection pooling is configured for optimal performance
- SSL is required for Neon connections
