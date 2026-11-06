# Library Management System

A full-stack library management system built with React and NestJS. This repo
currently contains the Week 1 data layer: a NestJS API connected to a hosted
PostgreSQL (Neon) database through Prisma.

## Tech Stack
- NestJS (TypeScript)
- Prisma ORM
- PostgreSQL hosted on Neon

## Getting Started
1. `cd api && npm install`
2. Copy `.env.example` to `.env` and set `DATABASE_URL` to your own Neon connection string.
3. `npx prisma migrate dev` to create the tables.
4. `npx prisma db seed` to insert 4 genres and 20 books.
5. `npm run start:dev` to run the API.

## Schema Decisions

**Why Book references Genre instead of embedding it.**
Each Book stores a `genreId` foreign key with a `@relation` to the Genre model,
rather than copying the genre's name and details inside every book row.

- **One source of truth.** A genre's name and slug live in exactly one row. If
  "Science Fiction" is renamed, I update one Genre row and every book reflects
  it. If it were embedded, I would have to find and edit every book, and a
  missed one would leave inconsistent data such as "Sci-Fi" and "Science Fiction".
- **No duplication.** Hundreds of books share a handful of genres. Embedding
  would repeat the same text in every row and waste storage.
- **Integrity.** The foreign key means a Book cannot point to a genre that does
  not exist, and the `@unique` constraints on `name` and `slug` prevent duplicate genres.
- **Easy queries.** Fetching all books in a genre (`WHERE genreId = 2`) or listing
  genres with their books is a simple relational query, and Prisma's generated
  types keep those queries type-safe.
- **Fits relational data.** Books and genres are a classic one-to-many
  relationship, which PostgreSQL models naturally.

**Other decisions**
- `Role` is an enum (`PATRON`, `LIBRARIAN`) so a user's role can only be one of
  those two values, enforced by the database.
- `Book` tracks `totalCopies` and `availableCopies` separately, which will be
  needed for borrow tracking in later weeks.
- `isbn` is `@unique` so the same book cannot be added twice.
- The seed script uses `upsert` and `skipDuplicates`, so it can be re-run safely.
- **Review (stretch):** a Review links one Book and one User, with
  `@@unique([bookId, userId])` so a user can review a book only once. Reviews are
  deleted along with their book or user (`onDelete: Cascade`).

## Prisma vs. a Document Database
The thing that felt different was that I had to decide the relationships up
front. In a document database I could have just nested a genre object inside each
book and moved on. In Prisma I had to define a separate Genre model, a `genreId`
foreign key, and a migration before I could save a single book. It was more work
at the start, but the schema now guarantees consistency, and my editor
autocompletes every query because Prisma generates types from the schema.