package com.kadaplatz.cart;

import com.kadaplatz.auth.User;
import com.kadaplatz.auth.UserService;
import com.kadaplatz.cart.dto.CartItemRequest;
import com.kadaplatz.cart.dto.CartItemResponse;
import com.kadaplatz.cart.dto.CartResponse;
import com.kadaplatz.product.Product;
import com.kadaplatz.product.ProductNotFoundException;
import com.kadaplatz.product.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

  private final CartRepository cartRepository;
  private final ProductRepository productRepository;
  private final UserService userService;

  public CartService(
    CartRepository cartRepository,
    ProductRepository productRepository,
    UserService userService
  ) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    this.userService = userService;
  }

  public CartResponse getCart(String email) {
    Cart cart = getOrCreateCart(email);
    return toCartResponse(cart);
  }

  @Transactional
  public CartResponse addItem(String email, CartItemRequest request) {
    Cart cart = getOrCreateCart(email);
    Product product = productRepository.findById(request.productId())
      .orElseThrow(() -> new ProductNotFoundException(request.productId()));

    cart.getItems().stream()
      .filter(item -> item.getProduct().getId().equals(product.getId()))
      .findFirst()
      .ifPresentOrElse(
        existing -> existing.setQuantity(existing.getQuantity() + request.quantity()),
        () -> cart.addItem(new CartItem(product, request.quantity()))
      );

    return toCartResponse(cartRepository.save(cart));
  }

  @Transactional
  public CartResponse updateItemQuantity(String email, Long productId, CartItemRequest request) {
    Cart cart = getOrCreateCart(email);

    CartItem item = cart.getItems().stream()
      .filter(i -> i.getProduct().getId().equals(productId))
      .findFirst()
      .orElseThrow(() -> new ProductNotFoundException(productId));

    item.setQuantity(request.quantity());
    return toCartResponse(cartRepository.save(cart));
  }

  @Transactional
  public CartResponse removeItem(String email, Long productId) {
    Cart cart = getOrCreateCart(email);

    cart.getItems().stream()
      .filter(i -> i.getProduct().getId().equals(productId))
      .findFirst()
      .ifPresent(cart::removeItem);

    return toCartResponse(cartRepository.save(cart));
  }

  @Transactional
  public void clearCart(String email) {
    Cart cart = getOrCreateCart(email);
    cart.clearItems();
    cartRepository.save(cart);
  }

  public Cart getOrCreateCart(String email) {
    User user = userService.getByEmail(email);

    return cartRepository.findByUserId(user.getId())
      .orElseGet(() -> cartRepository.save(new Cart(user.getId())));
  }

  private CartResponse toCartResponse(Cart cart) {
    List<CartItemResponse> items = cart.getItems().stream()
      .map(item -> new CartItemResponse(
        item.getProduct().getId(),
        item.getProduct().getName(),
        item.getProduct().getPrice(),
        item.getQuantity(),
        item.getProduct().getPrice() * item.getQuantity()
      ))
      .toList();

    double total = items.stream().mapToDouble(CartItemResponse::subtotal).sum();
    int itemCount = items.stream().mapToInt(CartItemResponse::quantity).sum();

    return new CartResponse(items, total, itemCount);
  }
}
