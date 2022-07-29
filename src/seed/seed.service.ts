import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async executeSeed() {
    this.deleteAllTables();
    const adminUser = await this.insertNewUsers();
    await this.insertNewProducts(adminUser);
    return { message: 'Seeded successfully' };
  }

  private async deleteAllTables() {
    //* Remove all products and images-products
    await this.productsService.removeAll();

    //* Remove all users
    const query = this.userRepository.createQueryBuilder();
    await query.delete().where({}).execute();
  }

  private async insertNewUsers() {
    const users = initialData.users;

    const insertUsers: User[] = [];

    users.forEach((user) => {
      user.password = bcrypt.hashSync(user.password, 10);
      insertUsers.push(this.userRepository.create(user));
    });

    const createdUsers = await this.userRepository.save(insertUsers);
    console.log(createdUsers);
    return createdUsers[0];
  }

  private async insertNewProducts(user: User) {
    await this.productsService.removeAll();

    const insertPromises = [];

    const products = initialData.products;

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
