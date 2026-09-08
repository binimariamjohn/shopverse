package com.shopverse.product;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

  @NotNull(message = "Product category is required")
  @Enumerated(EnumType.STRING)
  private Category category;

  public Product() {
  }

  public Product(String name, double price, Category category) {
    this.name = name;
    this.price = price;
    this.category = category;
  }

  public Product(Long id, String name, double price, Category category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
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

  public Category getCategory()
  {
    return category;
  }

  public void setCategory(Category category)
  {
    this.category = category;
  }
}