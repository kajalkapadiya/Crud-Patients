import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { CheckoutService } from '../services/checkout.service';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  fullAddress: string = '';
  isAvailable: boolean = true;
  unavailableItems: any[] = [];
  apikey = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3';
  successMessage: string | null = null;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const email = this.cartService.getLoggedInUserEmail();
    if (!email) {
      this._snackBar.open('User not logged in', 'close', { duration: 3000 });

      return;
    }

    this.cartService.getUserByEmail(email).subscribe(
      (user) => {
        if (user) {
          this.cartItems = user.cart || [];
        }
      },
      (error) => {
        this._snackBar.open('Error loading cart:', 'close', { duration: 3000 });
      }
    );
  }

  increaseQuantity(product: any): void {
    this.cartService.addToCart(product).subscribe(
      () => {
        this.loadCart();
      },
      (error) => {
        this._snackBar.open('Error increasing quantity', 'close', {
          duration: 3000,
        });
      }
    );
  }

  decreaseQuantity(product: any): void {
    this.cartService.removeFromCart(product).subscribe(
      () => {
        this.loadCart();
      },
      (error) => {
        this._snackBar.open('Error decreasing quantity', 'close', {
          duration: 3000,
        });
      }
    );
  }

  removeFromCart(product: any): void {
    this.cartService.deleteFromCart(product.medicine_id).subscribe(
      () => {
        this.loadCart();
      },
      (error) => {
        this._snackBar.open('Error removing from cart', 'close', {
          duration: 3000,
        });
      }
    );
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(
      () => {
        this.cartItems = [];
      },
      (error) => {
        this._snackBar.open('Error clearing cart', 'close', { duration: 3000 });
      }
    );
  }

  getTotalItems(): number {
    return this.cartItems.reduce(
      (total, item) => total + (item.quantity || 1),
      0
    );
  }

  getTotalPrice(): number {
    const total = this.cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
    return parseFloat(total.toFixed(2));
  }

  placeOrder(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const totalQuantity = this.getTotalItems();
    const totalPrice = this.getTotalPrice();
    const patient_email = localStorage.getItem('email');

    const orderData = {
      patient_name: form.value.patient_id,
      items: this.cartItems.map((item) => ({
        medicine_id: item.medicine_id,
        quantity: item.quantity,
      })),
      totalQuantity,
      totalPrice,
      apikey: this.apikey,
      address: form.value.address,
      address_line2: form.value.address_line2 || '',
      city: form.value.city,
      state: form.value.state,
      zipcode: form.value.zipcode,
      mobile: form.value.mobile,
      full_address: form.value.full_address,
    };

    this.cartService.placeOrder(orderData).subscribe(
      (response) => {
        this.successMessage =
          'Order placed successfully. <a href="/app-products" class="shopping-link">Continue shopping</a>';

        setTimeout(() => {
          this.cartService.clearCart().subscribe(
            () => {
              this.cartItems = [];
            },
            (error) => {}
          );
        }, 5000);
      },
      (error) => {
        this._snackBar.open('Order placement failed', 'close', {
          duration: 3000,
        });
      }
    );
  }
}
