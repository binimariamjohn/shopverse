package com.shopverse.common;

import com.shopverse.auth.exception.DuplicateEmailException;
import com.shopverse.auth.exception.InvalidCredentialsException;
import com.shopverse.auth.exception.InvalidRegistrationRoleException;
import com.shopverse.cart.exception.EmptyCartException;
import com.shopverse.order.exception.OrderNotFoundException;
import com.shopverse.product.ProductNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ProductNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleProductNotFound(
    ProductNotFoundException exception) {

    ErrorResponse errorResponse = new ErrorResponse(
      exception.getMessage(),
      null
    );

    return ResponseEntity
      .status(HttpStatus.NOT_FOUND)
      .body(errorResponse);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationException(
    MethodArgumentNotValidException exception) {

    Map<String, String> errors = new HashMap<>();

    exception.getBindingResult()
      .getFieldErrors()
      .forEach(error ->
                 errors.put(error.getField(), error.getDefaultMessage())
      );

    ErrorResponse errorResponse = new ErrorResponse(
      "Validation failed",
      errors
    );

    return ResponseEntity
      .badRequest()
      .body(errorResponse);
  }

  @ExceptionHandler(DuplicateEmailException.class)
  public ResponseEntity<ErrorResponse> handleDuplicateEmail(
    DuplicateEmailException exception
  ) {
    ErrorResponse errorResponse = new ErrorResponse(exception.getMessage(), null);
    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
  }

  @ExceptionHandler(InvalidCredentialsException.class)
  public ResponseEntity<ErrorResponse> handleInvalidCredentials(
    InvalidCredentialsException exception
  ) {
    ErrorResponse errorResponse = new ErrorResponse(exception.getMessage(), null);
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
  }

  @ExceptionHandler(InvalidRegistrationRoleException.class)
  public ResponseEntity<ErrorResponse> handleInvalidRegistrationRole(
    InvalidRegistrationRoleException exception
  ) {
    ErrorResponse errorResponse = new ErrorResponse(exception.getMessage(), null);
    return ResponseEntity.badRequest().body(errorResponse);
  }

  @ExceptionHandler(EmptyCartException.class)
  public ResponseEntity<ErrorResponse> handleEmptyCart(
    EmptyCartException exception
  ) {
    ErrorResponse errorResponse = new ErrorResponse(exception.getMessage(), null);
    return ResponseEntity.badRequest().body(errorResponse);
  }

  @ExceptionHandler(OrderNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleOrderNotFound(
    OrderNotFoundException exception
  ) {
    ErrorResponse errorResponse = new ErrorResponse(exception.getMessage(), null);
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
  }
}