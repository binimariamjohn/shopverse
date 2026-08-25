package com.kadaplatz.auth.exception;

public class InvalidRegistrationRoleException extends RuntimeException {

  public InvalidRegistrationRoleException() {
    super("ADMIN role cannot be assigned through self-registration");
  }
}
