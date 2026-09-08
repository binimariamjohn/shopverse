package com.shopverse.order.dto;

import jakarta.validation.constraints.NotBlank;

public record CheckoutRequest(
  @NotBlank(message = "Shipping address is required")
  String shippingAddress,

  // Mock payment — accepted but not processed
  String paymentCardNumber
) {
}
