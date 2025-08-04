package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend requests
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PostMapping("/add")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Collections.singletonMap("error", "This email is already registered. Please use another."));
        }

        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User existingUser = userService.getUserById(id);

        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        if (updatedUser.getUsername() != null) existingUser.setUsername(updatedUser.getUsername());
        if (updatedUser.getEmail() != null) existingUser.setEmail(updatedUser.getEmail());
        if (updatedUser.getPhno() != null) existingUser.setPhno(updatedUser.getPhno());
        if (updatedUser.getGender() != null) existingUser.setGender(updatedUser.getGender());
        if (updatedUser.getDob() != null) existingUser.setDob(updatedUser.getDob());
        if (updatedUser.getProfession() != null) existingUser.setProfession(updatedUser.getProfession());

        User savedUser = userService.updateUser(id, existingUser);
        return ResponseEntity.ok(savedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "User not found or could not be deleted"));
        }
    }

    @GetMapping("/details")
    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
        User user = userService.getUserByEmail(email);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    // ✅ New: Get user by username
    @GetMapping("/username")
    public ResponseEntity<User> getUserByUsername(@RequestParam String username) {
        User user = userService.getUserByUsername(username);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userService.authenticateUser(email, password);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Invalid email or password"));
        }

        String token = generateToken(user);
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }

    private String generateToken(User user) {
        return "userId=" + user.getId() + ", email=" + user.getEmail();
    }
}
