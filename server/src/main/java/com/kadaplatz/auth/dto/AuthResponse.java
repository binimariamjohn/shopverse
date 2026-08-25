package com.kadaplatz.auth.dto;

public record AuthResponse(
  String token,
  AuthUserResponse user
) {
}
