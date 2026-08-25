package com.kadaplatz.cart;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private Long userId;

  @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CartItem> items = new ArrayList<>();

  public Cart() {
  }

  public Cart(Long userId) {
    this.userId = userId;
  }

  public Long getId() {
    return id;
  }

  public Long getUserId() {
    return userId;
  }

  public List<CartItem> getItems() {
    return items;
  }

  public void addItem(CartItem item) {
    item.setCart(this);
    items.add(item);
  }

  public void removeItem(CartItem item) {
    items.remove(item);
  }

  public void clearItems() {
    items.clear();
  }
}
