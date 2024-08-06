import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { HttpClient } from '@angular/common/http';
import { CheckoutService } from '../checkout.service';
import { NgForm } from '@angular/forms';

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
  apikey = '';
  successMessage: string | null = null;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCart();
    // this.checkAvailability();
  }

  loadCart(): void {
    const email = this.cartService.getLoggedInUserEmail();
    if (!email) {
      console.error('User not logged in');
      return;
    }

    this.cartService.getUserByEmail(email).subscribe(
      (user) => {
        if (user) {
          this.cartItems = user.cart || [];
        }
      },
      (error) => {
        console.error('Error loading cart:', error);
      }
    );
  }

  increaseQuantity(product: any): void {
    this.cartService.addToCart(product).subscribe(
      () => {
        this.loadCart();
      },
      (error) => {
        console.error('Error increasing quantity:', error);
      }
    );
  }

  decreaseQuantity(product: any): void {
    this.cartService.removeFromCart(product).subscribe(
      () => {
        this.loadCart();
      },
      (error) => {
        console.error('Error decreasing quantity:', error);
      }
    );
  }

  removeFromCart(product: any): void {
    this.cartService.deleteFromCart(product.medicine_id).subscribe(
      () => {
        this.loadCart();
      },
      (error) => {
        console.error('Error removing from cart:', error);
      }
    );
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(
      () => {
        this.cartItems = [];
      },
      (error) => {
        console.error('Error clearing cart:', error);
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
    return this.cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  }

  placeOrder(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const totalQuantity = this.getTotalItems();
    const totalPrice = this.getTotalPrice();

    const orderData = {
      patient_id: form.value.patient_id,
      items: JSON.stringify(
        this.cartItems.map((item) => ({
          medicine_id: item.medicine_id,
          quantity: item.quantity,
        }))
      ),
      totalQuantity,
      totalPrice,
      apikey: this.apikey,
      address: form.value.address,
      address_line2: form.value.address_line2 || '',
      city: form.value.city,
      state: form.value.state,
      zipcode: form.value.zipcode,
      mobile: form.value.mobile,
      patient_name: form.value.patient_name || '',
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
        console.error('Order placement failed', error);
        alert('Order placement failed');
      }
    );
  }
}
