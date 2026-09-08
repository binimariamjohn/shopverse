package com.shopverse.order.dto;

public record OrderItemResponse(
  Long productId,
  String productName,
  double priceAtPurchase,
  int quantity,
  double subtotal
) {
}
