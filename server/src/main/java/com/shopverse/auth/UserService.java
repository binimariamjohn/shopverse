package com.shopverse.auth;

import com.shopverse.auth.exception.InvalidCredentialsException;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User getByEmail(String email) {
    return userRepository.findByEmailIgnoreCase(email)
      .orElseThrow(InvalidCredentialsException::new);
  }
}
