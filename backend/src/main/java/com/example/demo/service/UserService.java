package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Check if email already exists
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // Create a new user
    public User createUser(User user) {
        if (existsByEmail(user.getEmail())) {
            return null; // Or throw exception
        }
        return userRepository.save(user);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Get user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    // Authenticate user
    public User authenticateUser(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password).orElse(null);
    }

    // New: Get user by username
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    // Update user (only fields provided by the frontend)
    public User updateUser(Long id, User updatedUser) {
        User existingUser = getUserById(id);

        if (existingUser == null) {
            return null;
        }

        // Update only fields that are not null (to avoid overwriting valid data)
        if (updatedUser.getEmail() != null) existingUser.setEmail(updatedUser.getEmail());
        if (updatedUser.getPhno() != null) existingUser.setPhno(updatedUser.getPhno());
        if (updatedUser.getGender() != null) existingUser.setGender(updatedUser.getGender());
        if (updatedUser.getDob() != null) existingUser.setDob(updatedUser.getDob());
        if (updatedUser.getProfession() != null) existingUser.setProfession(updatedUser.getProfession());

        return userRepository.save(existingUser);
    }

    // Delete a user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
