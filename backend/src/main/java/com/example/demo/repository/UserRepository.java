package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

	// Method to check if the user exists by email
	boolean existsByEmail(String email);

	// Method to find user by email
	Optional<User> findByEmail(String email);

	// Method to find user by email and password
	Optional<User> findByEmailAndPassword(String email, String password);

	// Method to find user by username
	Optional<User> findByUsername(String username);
}
