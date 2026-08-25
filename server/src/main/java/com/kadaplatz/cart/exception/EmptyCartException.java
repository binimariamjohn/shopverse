package com.kadaplatz.cart.exception;

public class EmptyCartException extends RuntimeException {

  public EmptyCartException() {
    super("Cart is empty — add items before checking out");
  }
}
