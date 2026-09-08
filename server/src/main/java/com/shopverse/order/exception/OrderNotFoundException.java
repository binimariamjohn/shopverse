package com.shopverse.order.exception;

public class OrderNotFoundException extends RuntimeException {

  public OrderNotFoundException(Long id) {
    super("Order with ID " + id + " not found");
  }
}
