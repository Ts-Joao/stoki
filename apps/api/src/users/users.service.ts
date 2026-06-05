import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly hashingService: HashingServiceProtocol,
    private readonly databaseService: DatabaseService
  ) {}

  async findAll() {
    try {
      return await this.databaseService.user.findMany();
    } catch (error) {
      throw new InternalServerErrorException("Error to find all users", error);
    }
  }

  async findByName(name: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          name,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException("Error to find user by name", error);
    }
  }

  async findById(id: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          id,
        },
      });

      if(!user) {
        throw new NotFoundException("User not found");
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException("Error to find user by id", error);
    }
  }

  async create(dto: CreateUserDto) {
    try {
      const userExists = await this.findByName(dto.name);

      if(userExists) {
        throw new ConflictException("User already exists");
      }

      const { password, ...restDto } = dto;

      const hashedPassword = await this.hashingService.hash(password);

      const user = await this.databaseService.user.create({
        data: {
          ...restDto,
          password: hashedPassword
        }
      });

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException("Error to create user", error);
    }
  }

  async update(id: string, data: UpdateUserDto) {
    try {
      await this.findById(id);

      const user = await this.databaseService.user.update({
        where: {
          id,
        },
        data,
      });

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException("Error to update user", error);
    }
  }

  async delete(id: string) {
    try {
      await this.findById(id);

      const userDeleted = await this.databaseService.user.delete({
        where: {
          id,
        },
      });

      return userDeleted;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException("Error to delete user", error);
    }
  }
}