package com.kadaplatz.common;

import java.util.Map;

public record ErrorResponse(
  String message,
  Map<String, String> errors
) {
}