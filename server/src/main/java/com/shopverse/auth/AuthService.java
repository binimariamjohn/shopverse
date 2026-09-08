package com.shopverse.auth;

import com.shopverse.auth.dto.AuthResponse;
import com.shopverse.auth.dto.AuthUserResponse;
import com.shopverse.auth.dto.LoginRequest;
import com.shopverse.auth.dto.RegisterRequest;
import com.shopverse.auth.exception.DuplicateEmailException;
import com.shopverse.auth.exception.InvalidCredentialsException;
import com.shopverse.auth.exception.InvalidRegistrationRoleException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(
    UserRepository userRepository,
    PasswordEncoder passwordEncoder,
    JwtService jwtService
  ) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public AuthResponse register(RegisterRequest request) {
    String normalizedEmail = normalizeEmail(request.email());

    if (request.role() == Role.ADMIN) {
      throw new InvalidRegistrationRoleException();
    }

    if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
      throw new DuplicateEmailException(normalizedEmail);
    }

    User user = new User(
      normalizedEmail,
      passwordEncoder.encode(request.password()),
      request.role()
    );

    User savedUser = userRepository.save(user);
    return toAuthResponse(savedUser);
  }

  public AuthResponse login(LoginRequest request) {
    String normalizedEmail = normalizeEmail(request.email());

    User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
      .orElseThrow(InvalidCredentialsException::new);

    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new InvalidCredentialsException();
    }

    return toAuthResponse(user);
  }

  public AuthUserResponse getProfile(String email) {
    User user = userRepository.findByEmailIgnoreCase(normalizeEmail(email))
      .orElseThrow(InvalidCredentialsException::new);

    return toAuthUserResponse(user);
  }

  private AuthResponse toAuthResponse(User user) {
    String token = jwtService.generateToken(user);
    return new AuthResponse(token, toAuthUserResponse(user));
  }

  private AuthUserResponse toAuthUserResponse(User user) {
    return new AuthUserResponse(
      user.getId(),
      user.getEmail(),
      user.getRole()
    );
  }

  private String normalizeEmail(String email) {
    return email.trim().toLowerCase();
  }
}
