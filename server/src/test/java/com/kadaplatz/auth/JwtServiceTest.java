package com.kadaplatz.auth;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

  private static final String SECRET = "S2FkYVBsYXR6Snd0U2VjcmV0S2V5Rm9yTGVhcm5pbmdQdXJwb3NlT25seTIwMjY=";

  @Test
  void generateTokenProducesTokenThatMatchesUserAndExtractsNormalizedEmail() {
    JwtService jwtService = new JwtService(SECRET, 3_600_000);
    User user = new User("Seller@Example.com", "hash", Role.SELLER);

    String token = jwtService.generateToken(user);

    assertThat(token).isNotBlank();
    assertThat(jwtService.extractEmail(token)).isEqualTo("seller@example.com");
    assertThat(jwtService.isTokenValid(token, user)).isTrue();
  }

  @Test
  void tokenIsInvalidForDifferentUser() {
    JwtService jwtService = new JwtService(SECRET, 3_600_000);
    User owner = new User("owner@example.com", "hash", Role.SELLER);
    User otherUser = new User("other@example.com", "hash", Role.BUYER);

    String token = jwtService.generateToken(owner);

    assertThat(jwtService.isTokenValid(token, otherUser)).isFalse();
  }
}
