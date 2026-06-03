package com.example.shoestore.controller;

import com.example.shoestore.entity.CartItem;
import com.example.shoestore.entity.Product;
import com.example.shoestore.entity.User;
import com.example.shoestore.repository.CartItemRepository;
import com.example.shoestore.repository.ProductRepository;
import com.example.shoestore.repository.UserRepository;
import com.example.shoestore.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*") // Hỗ trợ gọi từ frontend
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Hàm hỗ trợ: Lấy ID của User đang đăng nhập từ Token (JWT)
    private Integer getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) principal).getUserId();
        }
        return null;
    }

    // 1. Lấy toàn bộ giỏ hàng của user hiện tại
    @GetMapping
    public ResponseEntity<?> getCart() {
        Integer userId = getCurrentUserId();
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        List<CartItem> items = cartItemRepository.findByUserId(userId);
        return ResponseEntity.ok(items);
    }

    // 2. Thêm sản phẩm vào giỏ
    @PostMapping("/items")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Integer> payload) {
        Integer userId = getCurrentUserId();
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        Integer productId = payload.get("productId");
        Integer quantity = payload.get("quantity");

        // Kiểm tra xem sản phẩm đã có trong giỏ chưa
        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductId(userId, productId);
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity); // Cộng dồn số lượng
            cartItemRepository.save(item);
            return ResponseEntity.ok(item);
        } else {
            CartItem newItem = new CartItem();
            User user = userRepository.findById(userId).orElse(null);
            Product product = productRepository.findById(productId).orElse(null);

            if (user == null || product == null) {
                return ResponseEntity.badRequest().body("Không tìm thấy người dùng hoặc sản phẩm");
            }

            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cartItemRepository.save(newItem);
            return ResponseEntity.ok(newItem);
        }
    }

    // 3. Cập nhật số lượng của 1 CartItem
    @PutMapping("/items/{id}")
    public ResponseEntity<?> updateCartItemQuantity(@PathVariable Integer id, @RequestBody Map<String, Integer> payload) {
        Integer userId = getCurrentUserId();
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        Optional<CartItem> optionalItem = cartItemRepository.findById(id);
        if (optionalItem.isPresent()) {
            CartItem item = optionalItem.get();
            // Kiểm tra bảo mật: chỉ cho phép sửa nếu item thuộc về user hiện tại
            if (!item.getUser().getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Forbidden");
            }
            
            item.setQuantity(payload.get("quantity"));
            cartItemRepository.save(item);
            return ResponseEntity.ok(item);
        }
        return ResponseEntity.notFound().build();
    }

    // 4. Xóa 1 CartItem khỏi giỏ
    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Integer id) {
        Integer userId = getCurrentUserId();
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        Optional<CartItem> optionalItem = cartItemRepository.findById(id);
        if (optionalItem.isPresent()) {
            CartItem item = optionalItem.get();
            // Kiểm tra bảo mật: chỉ cho phép xóa nếu item thuộc về user hiện tại
            if (!item.getUser().getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Forbidden");
            }
            cartItemRepository.delete(item);
            return ResponseEntity.ok(Map.of("message", "Đã xóa sản phẩm khỏi giỏ hàng"));
        }
        return ResponseEntity.notFound().build();
    }
}