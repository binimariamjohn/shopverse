package com.kadaplatz.order;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long userId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private OrderStatus status;

  @Column(nullable = false)
  private String shippingAddress;

  @Column(nullable = false)
  private double total;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderItem> items = new ArrayList<>();

  public Order() {
  }

  public Order(Long userId, String shippingAddress) {
    this.userId = userId;
    this.shippingAddress = shippingAddress;
    this.status = OrderStatus.PENDING;
    this.createdAt = LocalDateTime.now();
  }

  public void addItem(OrderItem item) {
    item.setOrder(this);
    items.add(item);
  }

  public void recalculateTotal() {
    this.total = items.stream()
      .mapToDouble(item -> item.getPriceAtPurchase() * item.getQuantity())
      .sum();
  }

  public Long getId() {
    return id;
  }

  public Long getUserId() {
    return userId;
  }

  public OrderStatus getStatus() {
    return status;
  }

  public void setStatus(OrderStatus status) {
    this.status = status;
  }

  public String getShippingAddress() {
    return shippingAddress;
  }

  public double getTotal() {
    return total;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public List<OrderItem> getItems() {
    return items;
  }
}
