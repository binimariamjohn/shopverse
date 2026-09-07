package com.kadaplatz.auth;

import com.kadaplatz.auth.dto.AuthResponse;
import com.kadaplatz.auth.dto.LoginRequest;
import com.kadaplatz.auth.dto.RegisterRequest;
import com.kadaplatz.auth.exception.DuplicateEmailException;
import com.kadaplatz.auth.exception.InvalidCredentialsException;
import com.kadaplatz.auth.exception.InvalidRegistrationRoleException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

  @Mock
  private UserRepository userRepository;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private JwtService jwtService;

  @InjectMocks
  private AuthService authService;

  private User savedUser;

  @BeforeEach
  void setUp() {
    savedUser = new User("seller@example.com", "encoded-password", Role.SELLER);
    savedUser.setId(7L);
  }

  @Test
  void registerNormalizesEmailAndReturnsToken() {
    RegisterRequest request = new RegisterRequest(" Seller@Example.com ", "password123", Role.SELLER);

    when(userRepository.existsByEmailIgnoreCase("seller@example.com")).thenReturn(false);
    when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
    when(userRepository.save(any(User.class))).thenReturn(savedUser);
    when(jwtService.generateToken(savedUser)).thenReturn("jwt-token");

    AuthResponse response = authService.register(request);

    ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
    verify(userRepository).save(userCaptor.capture());

    User persistedUser = userCaptor.getValue();
    assertThat(persistedUser.getEmail()).isEqualTo("seller@example.com");
    assertThat(persistedUser.getPasswordHash()).isEqualTo("encoded-password");
    assertThat(persistedUser.getRole()).isEqualTo(Role.SELLER);

    assertThat(response.token()).isEqualTo("jwt-token");
    assertThat(response.user().email()).isEqualTo("seller@example.com");
    assertThat(response.user().role()).isEqualTo(Role.SELLER);
  }

  @Test
  void registerRejectsDuplicateEmail() {
    RegisterRequest request = new RegisterRequest("seller@example.com", "password123", Role.SELLER);

    when(userRepository.existsByEmailIgnoreCase("seller@example.com")).thenReturn(true);

    assertThatThrownBy(() -> authService.register(request))
      .isInstanceOf(DuplicateEmailException.class)
      .hasMessage("An account with email seller@example.com already exists");

    verify(userRepository, never()).save(any(User.class));
  }

  @Test
  void registerRejectsAdminRole() {
    RegisterRequest request = new RegisterRequest("admin@example.com", "password123", Role.ADMIN);

    assertThatThrownBy(() -> authService.register(request))
      .isInstanceOf(InvalidRegistrationRoleException.class)
      .hasMessage("ADMIN role cannot be assigned through self-registration");

    verify(userRepository, never()).save(any(User.class));
  }

  @Test
  void loginReturnsTokenForValidCredentials() {
    LoginRequest request = new LoginRequest(" Seller@Example.com ", "password123");

    when(userRepository.findByEmailIgnoreCase("seller@example.com")).thenReturn(Optional.of(savedUser));
    when(passwordEncoder.matches("password123", "encoded-password")).thenReturn(true);
    when(jwtService.generateToken(savedUser)).thenReturn("jwt-token");

    AuthResponse response = authService.login(request);

    assertThat(response.token()).isEqualTo("jwt-token");
    assertThat(response.user().id()).isEqualTo(7L);
    assertThat(response.user().email()).isEqualTo("seller@example.com");
  }

  @Test
  void loginRejectsInvalidPassword() {
    LoginRequest request = new LoginRequest("seller@example.com", "wrong-password");

    when(userRepository.findByEmailIgnoreCase("seller@example.com")).thenReturn(Optional.of(savedUser));
    when(passwordEncoder.matches("wrong-password", "encoded-password")).thenReturn(false);

    assertThatThrownBy(() -> authService.login(request))
      .isInstanceOf(InvalidCredentialsException.class)
      .hasMessage("Invalid email or password");
  }
}
