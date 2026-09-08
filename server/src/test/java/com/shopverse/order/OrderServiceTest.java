package com.shopverse.order;

import com.shopverse.auth.Role;
import com.shopverse.auth.User;
import com.shopverse.auth.UserService;
import com.shopverse.cart.Cart;
import com.shopverse.cart.CartItem;
import com.shopverse.cart.CartService;
import com.shopverse.cart.exception.EmptyCartException;
import com.shopverse.order.dto.CheckoutRequest;
import com.shopverse.order.dto.OrderResponse;
import com.shopverse.product.Category;
import com.shopverse.product.Product;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

  @Mock
  private OrderRepository orderRepository;

  @Mock
  private CartService cartService;

  @Mock
  private UserService userService;

  @InjectMocks
  private OrderService orderService;

  @Test
  void checkoutCreatesOrderFromCartAndClearsCart() {
    User user = new User("buyer@example.com", "hash", Role.BUYER);
    user.setId(10L);

    Product headphones = new Product(1L, "Headphones", 99.99, Category.ELECTRONICS);
    Product keyboard = new Product(2L, "Keyboard", 49.50, Category.ELECTRONICS);

    Cart cart = new Cart(10L);
    cart.addItem(new CartItem(headphones, 2));
    cart.addItem(new CartItem(keyboard, 1));

    when(userService.getByEmail("buyer@example.com")).thenReturn(user);
    when(cartService.getOrCreateCart("buyer@example.com")).thenReturn(cart);
    when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
      Order order = invocation.getArgument(0);
      var idField = Order.class.getDeclaredField("id");
      idField.setAccessible(true);
      idField.set(order, 25L);
      return order;
    });

    OrderResponse response = orderService.checkout(
      "buyer@example.com",
      new CheckoutRequest("123 Main St", "4242424242424242")
    );

    ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);
    verify(orderRepository).save(orderCaptor.capture());
    verify(cartService).clearCart("buyer@example.com");

    Order savedOrder = orderCaptor.getValue();
    assertThat(savedOrder.getUserId()).isEqualTo(10L);
    assertThat(savedOrder.getStatus()).isEqualTo(OrderStatus.CONFIRMED);
    assertThat(savedOrder.getItems()).hasSize(2);
    assertThat(savedOrder.getTotal()).isEqualTo(249.48);

    assertThat(response.id()).isEqualTo(25L);
    assertThat(response.total()).isEqualTo(249.48);
    assertThat(response.items()).hasSize(2);
    assertThat(response.items().getFirst().productName()).isEqualTo("Headphones");
  }

  @Test
  void checkoutRejectsEmptyCart() {
    User user = new User("buyer@example.com", "hash", Role.BUYER);
    user.setId(10L);
    Cart emptyCart = new Cart(10L);

    when(userService.getByEmail("buyer@example.com")).thenReturn(user);
    when(cartService.getOrCreateCart("buyer@example.com")).thenReturn(emptyCart);

    assertThatThrownBy(() -> orderService.checkout(
      "buyer@example.com",
      new CheckoutRequest("123 Main St", "4242424242424242")
    )).isInstanceOf(EmptyCartException.class);

    verify(orderRepository, never()).save(any(Order.class));
    verify(cartService, never()).clearCart("buyer@example.com");
  }
}
