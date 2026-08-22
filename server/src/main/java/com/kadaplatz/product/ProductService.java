package com.kadaplatz.product;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

  private final ProductRepository productRepository;

  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  public List<Product> getAllProducts() {
    return productRepository.findAll();
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