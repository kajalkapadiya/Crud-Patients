import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductComponent {
  searchTerm: string = '';
  products: any[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  searchProducts() {
    if (!this.searchTerm.trim()) {
      this.products = [];
      return;
    }

    this.productService.searchProducts(this.searchTerm).subscribe(
      (response) => {
        if (response.status_code === '1') {
          console.log(response.data);
          this.products = response.data.result;
        } else {
          console.error('Error:', response.status_message);
          this.products = [];
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.products = [];
      }
    );
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product).subscribe(
      () => {
        alert(`${product.medicine_name} added to cart.`);
      },
      (error) => {
        console.error('Error adding to cart:', error);
      }
    );
  }
}
