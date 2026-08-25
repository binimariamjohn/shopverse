package com.kadaplatz.cart.dto;

import java.util.List;

public record CartResponse(
  List<CartItemResponse> items,
  double total,
  int itemCount
) {
}
