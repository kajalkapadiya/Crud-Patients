import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { HttpClient } from '@angular/common/http';
import { CheckoutService } from '../checkout.service';

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
    this.cartService.getCart().subscribe(
      (items) => {
        this.cartItems = items;
        console.log(this.cartItems);
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
    this.cartService.deleteFromCart(product).subscribe(
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

  checkAvailability(): void {
    const medicineIds = this.cartItems.map((item) => item.id);
    this.cartService.checkAvailability(medicineIds, this.fullAddress).subscribe(
      (response: any) => {
        // Assuming the response contains an array of available item IDs
        const availableIds = response.available_ids;
        this.isAvailable = this.cartItems.every((item) =>
          availableIds.includes(item.id)
        );
        this.unavailableItems = this.cartItems.filter(
          (item) => !availableIds.includes(item.id)
        );
      },
      (error) => {
        console.error('Error checking availability:', error);
        this.isAvailable = false;
      }
    );
  }

  placeOrder(): void {
    const medicineIds = this.cartItems.map((item) => item.medicine_id); // Adjust according to your actual field name
    const latitude = 12.9716; // Replace with actual latitude
    const longitude = 77.5946; // Replace with actual longitude
    const fullAddress = '560008'; // Replace with actual address if needed

    this.checkoutService
      .checkout(medicineIds, latitude, longitude, fullAddress)
      .subscribe(
        (response) => {
          console.log('Checkout response:', response);
          // Handle the response, update UI, etc.
        },
        (error) => {
          console.error('Checkout error:', error);
          // Handle error, show notification, etc.
        }
      );
  }
}
