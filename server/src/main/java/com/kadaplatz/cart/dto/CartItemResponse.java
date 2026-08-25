package com.kadaplatz.cart.dto;

public record CartItemResponse(
  Long productId,
  String productName,
  double price,
  int quantity,
  double subtotal
) {
}
