import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async findAll(genreId?: string, search?: string, page?: string, limit?: string) {
    const pageNumber = this.toPositiveInt(page, 'page', 1);
    const limitNumber = Math.min(this.toPositiveInt(limit, 'limit', 10), 100);

    // Build the Prisma where clause from the optional filters
    const where: Prisma.BookWhereInput = {};
    if (genreId) {
      where.genreId = this.toPositiveInt(genreId, 'genreId', 0);
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    // skip/take implement pagination; count gives the total for the client
    const [data, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        include: { genre: true },
        orderBy: { title: 'asc' },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  async create(dto: CreateBookDto) {
    try {
      return await this.prisma.book.create({
        data: { ...dto, availableCopies: dto.totalCopies },
        include: { genre: true },
      });
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async update(id: number, dto: UpdateBookDto) {
    const book = await this.findOne(id);
    const data: Prisma.BookUncheckedUpdateInput = { ...dto };

    // Keep availableCopies in step when the total changes
    if (dto.totalCopies !== undefined) {
      const availableCopies =
        book.availableCopies + (dto.totalCopies - book.totalCopies);
      if (availableCopies < 0) {
        throw new BadRequestException(
          'totalCopies cannot be lower than the number of copies currently borrowed',
        );
      }
      data.availableCopies = availableCopies;
    }

    try {
      return await this.prisma.book.update({
        where: { id },
        data,
        include: { genre: true },
      });
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }

  private toPositiveInt(value: string | undefined, name: string, fallback: number) {
    if (value === undefined || value === '') return fallback;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new BadRequestException(`${name} must be a positive whole number`);
    }
    return parsed;
  }

  private mapError(error: unknown): unknown {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return new ConflictException('A book with that ISBN already exists');
      }
      if (error.code === 'P2003') {
        return new BadRequestException('That genreId does not exist');
      }
    }
    return error;
  }
}