package com.kadaplatz.auth.dto;

import com.kadaplatz.auth.Role;

public record AuthUserResponse(
  Long id,
  String email,
  Role role
) {
}
