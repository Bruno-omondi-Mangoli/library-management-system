import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const genres = [
  { name: 'Fiction', slug: 'fiction' },
  { name: 'Science Fiction', slug: 'science-fiction' },
  { name: 'Non-Fiction', slug: 'non-fiction' },
  { name: 'Technology', slug: 'technology' },
];

const books = [
  // Fiction
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', genre: 'fiction', copies: 3 },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084', genre: 'fiction', copies: 4 },
  { title: '1984', author: 'George Orwell', isbn: '9780451524935', genre: 'fiction', copies: 5 },
  { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518', genre: 'fiction', copies: 2 },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '9780316769488', genre: 'fiction', copies: 3 },
  // Science Fiction
  { title: 'Dune', author: 'Frank Herbert', isbn: '9780441013593', genre: 'science-fiction', copies: 4 },
  { title: 'Neuromancer', author: 'William Gibson', isbn: '9780441569595', genre: 'science-fiction', copies: 2 },
  { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', isbn: '9780441478125', genre: 'science-fiction', copies: 2 },
  { title: 'Foundation', author: 'Isaac Asimov', isbn: '9780553293357', genre: 'science-fiction', copies: 3 },
  { title: "Ender's Game", author: 'Orson Scott Card', isbn: '9780812550702', genre: 'science-fiction', copies: 3 },
  // Non-Fiction
  { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780062316097', genre: 'non-fiction', copies: 4 },
  { title: 'Educated', author: 'Tara Westover', isbn: '9780399590504', genre: 'non-fiction', copies: 3 },
  { title: 'The Immortal Life of Henrietta Lacks', author: 'Rebecca Skloot', isbn: '9781400052189', genre: 'non-fiction', copies: 2 },
  { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '9780553380163', genre: 'non-fiction', copies: 3 },
  { title: 'Silent Spring', author: 'Rachel Carson', isbn: '9780618249060', genre: 'non-fiction', copies: 2 },
  // Technology
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', genre: 'technology', copies: 4 },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt and David Thomas', isbn: '9780135957059', genre: 'technology', copies: 3 },
  { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', isbn: '9781593279509', genre: 'technology', copies: 3 },
  { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '9781449373320', genre: 'technology', copies: 2 },
  { title: 'Refactoring', author: 'Martin Fowler', isbn: '9780134757599', genre: 'technology', copies: 2 },
];

async function main() {
  // 1. Genres (upsert so the seed is safe to re-run)
  const genreIds: Record<string, number> = {};
  for (const g of genres) {
    const genre = await prisma.genre.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    });
    genreIds[g.slug] = genre.id;
  }

  // 2. Books, each pointing at its genre via genreId
  await prisma.book.createMany({
    data: books.map((b) => ({
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      totalCopies: b.copies,
      availableCopies: b.copies,
      genreId: genreIds[b.genre],
    })),
    skipDuplicates: true,
  });

  // 3. Two users, one per role
  await prisma.user.upsert({
    where: { email: 'librarian@library.test' },
    update: {},
    create: { email: 'librarian@library.test', name: 'Lara Librarian', role: Role.LIBRARIAN },
  });
  await prisma.user.upsert({
    where: { email: 'patron@library.test' },
    update: {},
    create: { email: 'patron@library.test', name: 'Paul Patron', role: Role.PATRON },
  });

  const [genreCount, bookCount] = await Promise.all([
    prisma.genre.count(),
    prisma.book.count(),
  ]);
  console.log(`Seeded ${genreCount} genres and ${bookCount} books.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });