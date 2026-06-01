package com.example.shoestore.controller;

import com.example.shoestore.dto.LoginRequest;
import com.example.shoestore.dto.LoginResponse;
import com.example.shoestore.dto.RegisterRequest;
import com.example.shoestore.entity.User;
import com.example.shoestore.repository.UserRepository;
import com.example.shoestore.security.JwtUtils;
import com.example.shoestore.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(new LoginResponse(jwt, userDetails.getUserId(), userDetails.getRole()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        // Kiểm tra username đã tồn tại chưa
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Username đã tồn tại");
            return ResponseEntity.badRequest().body(error);
        }
        // Kiểm tra email đã tồn tại chưa
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email đã được sử dụng");
            return ResponseEntity.badRequest().body(error);
        }
        // Tạo user mới
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(User.Role.USER);
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("Đăng ký thành công");
    }
}