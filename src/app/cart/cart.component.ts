import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(
      (items) => {
        this.cartItems = items;
      },
      (error) => {
        console.error('Error loading cart:', error);
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
}
