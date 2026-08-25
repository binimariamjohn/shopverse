package com.kadaplatz.cart;

import com.kadaplatz.cart.dto.CartItemRequest;
import com.kadaplatz.cart.dto.CartResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cart")
public class CartController {

  private final CartService cartService;

  public CartController(CartService cartService) {
    this.cartService = cartService;
  }

  @GetMapping
  public CartResponse getCart(Authentication authentication) {
    return cartService.getCart(authentication.getName());
  }

  @PostMapping("/items")
  @ResponseStatus(HttpStatus.CREATED)
  public CartResponse addItem(
    Authentication authentication,
    @Valid @RequestBody CartItemRequest request
  ) {
    return cartService.addItem(authentication.getName(), request);
  }

  @PutMapping("/items/{productId}")
  public CartResponse updateItem(
    Authentication authentication,
    @PathVariable Long productId,
    @Valid @RequestBody CartItemRequest request
  ) {
    return cartService.updateItemQuantity(authentication.getName(), productId, request);
  }

  @DeleteMapping("/items/{productId}")
  public CartResponse removeItem(
    Authentication authentication,
    @PathVariable Long productId
  ) {
    return cartService.removeItem(authentication.getName(), productId);
  }

  @DeleteMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void clearCart(Authentication authentication) {
    cartService.clearCart(authentication.getName());
  }
}
