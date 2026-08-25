package com.kadaplatz.order.dto;

import com.kadaplatz.order.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
  Long id,
  OrderStatus status,
  String shippingAddress,
  double total,
  LocalDateTime createdAt,
  List<OrderItemResponse> items
) {
}
