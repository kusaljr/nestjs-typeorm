import { Module } from '@nestjs/common';

import { ProductController } from './controllers/product.controller';
import { CategoryController } from './controllers/category.controller';
import { BrandController } from './controllers/brand.controller';

import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { BrandService } from './services/brand.service';

@Module({
  controllers: [ProductController, CategoryController, BrandController],
  providers: [ProductService, BrandService, CategoryService],
})
export class ProductsModule {}
