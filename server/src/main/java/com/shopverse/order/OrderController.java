package com.shopverse.order;

import com.shopverse.order.dto.CheckoutRequest;
import com.shopverse.order.dto.OrderResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
public class OrderController {

  private final OrderService orderService;

  public OrderController(OrderService orderService) {
    this.orderService = orderService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public OrderResponse checkout(
    Authentication authentication,
    @Valid @RequestBody CheckoutRequest request
  ) {
    return orderService.checkout(authentication.getName(), request);
  }

  @GetMapping
  public Page<OrderResponse> getOrders(
    Authentication authentication,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
  ) {
    return orderService.getOrders(authentication.getName(), page, size);
  }

  @GetMapping("/{id}")
  public OrderResponse getOrderById(
    Authentication authentication,
    @PathVariable Long id
  ) {
    return orderService.getOrderById(authentication.getName(), id);
  }
}
