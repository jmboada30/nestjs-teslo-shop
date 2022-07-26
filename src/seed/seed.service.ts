import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  executeSeed() {
    return this.insertNewProducts();
  }

  private async insertNewProducts() {
    await this.productsService.removeAll();

    const insertPromises = [];

    const products = initialData.products;

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product));
    });

    await Promise.all(insertPromises);

    return { message: 'Seeded successfully' };
  }
}
