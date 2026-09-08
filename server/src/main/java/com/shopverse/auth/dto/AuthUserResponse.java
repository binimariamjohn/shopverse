package com.shopverse.auth.dto;

import com.shopverse.auth.Role;

public record AuthUserResponse(
  Long id,
  String email,
  Role role
) {
}
