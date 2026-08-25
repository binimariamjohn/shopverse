package com.kadaplatz.order;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_items")
public class OrderItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "order_id", nullable = false)
  private Order order;

  @Column(nullable = false)
  private Long productId;

  // Snapshot fields — persist product state at time of purchase
  @Column(nullable = false)
  private String productName;

  @Column(nullable = false)
  private double priceAtPurchase;

  @Column(nullable = false)
  private int quantity;

  public OrderItem() {
  }

  public OrderItem(Long productId, String productName, double priceAtPurchase, int quantity) {
    this.productId = productId;
    this.productName = productName;
    this.priceAtPurchase = priceAtPurchase;
    this.quantity = quantity;
  }

  public Long getId() {
    return id;
  }

  public Order getOrder() {
    return order;
  }

  public void setOrder(Order order) {
    this.order = order;
  }

  public Long getProductId() {
    return productId;
  }

  public String getProductName() {
    return productName;
  }

  public double getPriceAtPurchase() {
    return priceAtPurchase;
  }

  public int getQuantity() {
    return quantity;
  }
}
