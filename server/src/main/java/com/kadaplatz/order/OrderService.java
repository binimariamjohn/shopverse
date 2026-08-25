package com.kadaplatz.order;

import com.kadaplatz.auth.User;
import com.kadaplatz.auth.UserService;
import com.kadaplatz.cart.Cart;
import com.kadaplatz.cart.CartService;
import com.kadaplatz.cart.exception.EmptyCartException;
import com.kadaplatz.order.dto.CheckoutRequest;
import com.kadaplatz.order.dto.OrderItemResponse;
import com.kadaplatz.order.dto.OrderResponse;
import com.kadaplatz.order.exception.OrderNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

  private final OrderRepository orderRepository;
  private final CartService cartService;
  private final UserService userService;

  public OrderService(
    OrderRepository orderRepository,
    CartService cartService,
    UserService userService
  ) {
    this.orderRepository = orderRepository;
    this.cartService = cartService;
    this.userService = userService;
  }

  @Transactional
  public OrderResponse checkout(String email, CheckoutRequest request) {
    User user = userService.getByEmail(email);
    Cart cart = cartService.getOrCreateCart(email);

    if (cart.getItems().isEmpty()) {
      throw new EmptyCartException();
    }

    Order order = new Order(user.getId(), request.shippingAddress());

    cart.getItems().forEach(cartItem ->
      order.addItem(new OrderItem(
        cartItem.getProduct().getId(),
        cartItem.getProduct().getName(),
        cartItem.getProduct().getPrice(),
        cartItem.getQuantity()
      ))
    );

    order.recalculateTotal();
    order.setStatus(OrderStatus.CONFIRMED);

    Order savedOrder = orderRepository.save(order);

    // Clear cart after successful checkout
    cartService.clearCart(email);

    return toOrderResponse(savedOrder);
  }

  public Page<OrderResponse> getOrders(String email, int page, int size) {
    User user = userService.getByEmail(email);
    return orderRepository
      .findByUserIdOrderByCreatedAtDesc(user.getId(), PageRequest.of(page, size))
      .map(this::toOrderResponse);
  }

  public OrderResponse getOrderById(String email, Long orderId) {
    User user = userService.getByEmail(email);
    Order order = orderRepository.findById(orderId)
      .orElseThrow(() -> new OrderNotFoundException(orderId));

    // Users can only see their own orders
    if (!order.getUserId().equals(user.getId())) {
      throw new OrderNotFoundException(orderId);
    }

    return toOrderResponse(order);
  }

  private OrderResponse toOrderResponse(Order order) {
    List<OrderItemResponse> items = order.getItems().stream()
      .map(item -> new OrderItemResponse(
        item.getProductId(),
        item.getProductName(),
        item.getPriceAtPurchase(),
        item.getQuantity(),
        item.getPriceAtPurchase() * item.getQuantity()
      ))
      .toList();

    return new OrderResponse(
      order.getId(),
      order.getStatus(),
      order.getShippingAddress(),
      order.getTotal(),
      order.getCreatedAt(),
      items
    );
  }
}
