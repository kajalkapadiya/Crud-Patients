import { Component, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    private route: Router,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal
  ) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  searchProducts() {
    if (!this.searchTerm.trim()) {
      this.products = [];
      return;
    }

    this.productService.searchProducts(this.searchTerm).subscribe(
      (response) => {
        if (response.status_code === '1') {
          this.searchPerformed = true;
          this.products = response.data.result.slice(0, 14);
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
                this._snackBar.open(
                  'Unable to check product availability. Please try again later.',
                  'close',
                  { duration: 3000 }
                );
              }
            },
            (error) => {
              this._snackBar.open(
                'Error checking availability. Please try again later.',
                'close',
                { duration: 3000 }
              );
            }
          );
        } else {
          this._snackBar.open(
            'Unable to perform product search. Please try again later.',
            'close',
            { duration: 3000 }
          );
          this.searchPerformed = false;
        }
      },
      (error) => {
        this._snackBar.open(
          'Error fetching products, please try again later.',
          'close',
          { duration: 3000 }
        );
      }
    );
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product).subscribe(
      () => {
        this.shakeButton(this.cartButton);
        this.openSnackBar(
          'your medicine is added to the cart successfully!',
          'close'
        );
      },
      (error) => {
        this._snackBar.open('Error adding to cart', 'close', {
          duration: 3000,
        });
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
  //       }
  //     },
  //     (error) => {
  //     }
  //   );
  // }

  fetchProductDetails(medicineId: string, content: TemplateRef<any>) {
    this.productService.getProductDetails(medicineId).subscribe(
      (response) => {
        if (response.status_code === '1') {
          this.selectedProductDetails = response.data;
          setTimeout(() => {
            // this.openModal();
            this.modalService.open(content, {
              ariaLabelledBy: 'modal-basic-title',
            });
          }, 0);
        } else {
          this._snackBar.open(
            'Unable to fetch product details. Please try again later.',
            'Close',
            { duration: 3000 }
          );
        }
      },
      (error) => {
        this._snackBar.open(
          'Error fetching product details. Please try again later.',
          'Close',
          { duration: 3000 }
        );
      }
    );
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  closeModel() {
    const modelDiv = document.getElementById('productDetailsModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
    }
    this.modalService.dismissAll();
  }

  fetchProductDetailsByIds(medicineIds: string[]) {
    if (medicineIds.length < 2) {
      this._snackBar.open(
        'At least 2 medicine IDs are required to fetch details.',
        'Close',
        { duration: 3000 }
      );
      return;
    }

    this.productService.getProductDetails(undefined, medicineIds).subscribe(
      (response) => {
        if (response.status_code === '1') {
          this.selectedProductDetails = response.data;
        } else {
          this._snackBar.open(
            'Unable to fetch product details. Please try again later.',
            'Close',
            { duration: 3000 }
          );
        }
      },
      (error) => {
        this._snackBar.open(
          'Error fetching product details. Please try again later.',
          'Close',
          { duration: 3000 }
        );
      }
    );
  }
}
