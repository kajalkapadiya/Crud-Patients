import { Component, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductComponent {
  searchTerm: string = '';
  products: any[] = [];
  searchPerformed: boolean = false;
  selectedProductDetails: any = null;

  @ViewChild('cartButton') cartButton!: ElementRef;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: Router
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
          this.searchPerformed = true;
          this.products = response.data.result;
        } else {
          console.error('Error:', response.status_message);
          this.products = [];
          this.searchPerformed = false;
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
        this.shakeButton(this.cartButton);
      },
      (error) => {
        console.error('Error adding to cart:', error);
      }
    );
  }
  shakeButton(button: ElementRef): void {
    const element = button.nativeElement;
    element.classList.add('shake');
    setTimeout(() => {
      element.classList.remove('shake');
    }, 500);
  }

  showCart() {
    this.route.navigate(['/app-cart']);
  }

  fetchProductDetails(medicineId: string) {
    console.log(medicineId);
    this.productService.getProductDetails(medicineId).subscribe(
      (response) => {
        if (response.status_code === '1') {
          console.log(response.data);
          this.selectedProductDetails = response.data; // Store the details
        } else {
          console.error('Error:', response.status_message);
        }
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  fetchProductDetailsByIds(medicineIds: string[]) {
    if (medicineIds.length < 2) {
      console.error('Error: At least 2 medicine IDs are required.');
      return;
    }

    this.productService.getProductDetails(undefined, medicineIds).subscribe(
      (response) => {
        if (response.status_code === '1') {
          console.log(response.data);
          this.selectedProductDetails = response.data; // Store the details
        } else {
          console.error('Error:', response.status_message);
        }
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }
}
