package com.kadaplatz.product;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Entity
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "Product name must not be empty")
  private String name;

  @Positive(message = "Product price must be greater than zero")
  private double price;

  public Product() {
  }

  public Product(String name, double price) {
    this.name = name;
    this.price = price;
  }

  public Product(Long id, String name, double price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public double getPrice() {
    return price;
  }

  public void setPrice(double price) {
    this.price = price;
  }
}