package com.shopverse.auth.dto;

public record AuthResponse(
  String token,
  AuthUserResponse user
) {
}
