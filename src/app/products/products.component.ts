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
          this.searchPerformed = true;
          this.products = response.data.result;
          const medicineIds = this.products.map(
            (product: any) => product.medicine_id
          );

          this.productService.checkAvailability(medicineIds).subscribe(
            (availabilityResponse) => {
              if (availabilityResponse.status_code === '1') {
                this.products.forEach((product) => {
                  const availability =
                    availabilityResponse.data.availability.find(
                      (item: any) => item.medicine_id === product.medicine_id
                    );
                  product.in_stock = availability
                    ? availability.in_stock
                    : 'no';
                });
              } else {
                console.error('Error:', availabilityResponse.status_message);
              }
            },
            (error) => {
              console.error('Error checking availability:', error);
            }
          );
        } else {
          console.error('Error:', response.status_message);
          this.searchPerformed = false;
        }
      },
      (error) => {
        console.error('Error fetching products:', error);
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

  // fetchProductDetails(medicineId: string) {
  //   this.productService.getProductDetails(medicineId).subscribe(
  //     (response) => {
  //       if (response.status_code === '1') {
  //         this.selectedProductDetails = response.data; // Store the details
  //       } else {
  //         console.error('Error:', response.status_message);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching product details:', error);
  //     }
  //   );
  // }

  fetchProductDetails(medicineId: string) {
    this.productService.getProductDetails(medicineId).subscribe(
      (response) => {
        if (response.status_code === '1') {
          this.selectedProductDetails = response.data;
          this.openModal();
        } else {
          console.error('Error:', response.status_message);
        }
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  openModal() {
    const modalElement = document.getElementById('productDetailsModal');
    if (modalElement) {
      (modalElement as any).style.display = 'block';
      modalElement.classList.add('show');
    }
  }

  closeModal() {
    const modalElement = document.getElementById('productDetailsModal');
    if (modalElement) {
      (modalElement as any).style.display = 'none';
      modalElement.classList.remove('show');
    }
  }

  fetchProductDetailsByIds(medicineIds: string[]) {
    if (medicineIds.length < 2) {
      console.error('Error: At least 2 medicine IDs are required.');
      return;
    }

    this.productService.getProductDetails(undefined, medicineIds).subscribe(
      (response) => {
        if (response.status_code === '1') {
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
