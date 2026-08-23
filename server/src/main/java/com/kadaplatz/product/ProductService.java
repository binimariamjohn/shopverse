package com.kadaplatz.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

  private final ProductRepository productRepository;

  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  public Page<Product> getProducts(
    String search,
    ProductSort productSort,
    int page,
    int size
  ) {
    Sort sort = switch (productSort) {
      case NAME_ASC -> Sort.by("name").ascending();
      case NAME_DESC -> Sort.by("name").descending();
      case PRICE_ASC -> Sort.by("price").ascending();
      case PRICE_DESC -> Sort.by("price").descending();
      case NEWEST -> Sort.by("id").descending();
    };

    Pageable pageable = PageRequest.of(page, size, sort);

    if (search == null || search.isBlank()) {
      return productRepository.findAll(pageable);
    }

    return productRepository.findByNameContainingIgnoreCase(
      search,
      pageable
    );
  }

  public Product getProductById(Long id) {
    return productRepository.findById(id)
      .orElseThrow(() -> new ProductNotFoundException(id));
  }

  public Product createProduct(Product product) {
    return productRepository.save(product);
  }

  public Product updateProduct(Long id, Product updatedProduct) {
    Product existingProduct = getProductById(id);

    existingProduct.setName(updatedProduct.getName());
    existingProduct.setPrice(updatedProduct.getPrice());

    return productRepository.save(existingProduct);
  }

  public void deleteProduct(Long id) {
    Product product = getProductById(id);
    productRepository.delete(product);
  }
}