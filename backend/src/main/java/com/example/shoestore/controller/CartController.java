package com.example.shoestore.controller;

import com.example.shoestore.dto.CartItemRequest;
import com.example.shoestore.dto.CartResponse;
import com.example.shoestore.entity.CartItem;
import com.example.shoestore.security.UserDetailsImpl;
import com.example.shoestore.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CartController {

	@Autowired
	private CartService cartService;

	// Lấy giỏ hàng của user hiện tại
	@GetMapping
	public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetailsImpl currentUser) {
		Integer userId = currentUser.getUserId();
		CartResponse cart = cartService.getCartByUserId(userId);
		return ResponseEntity.ok(cart);
	}

	// Thêm sản phẩm vào giỏ
	@PostMapping("/items")
	public ResponseEntity<?> addToCart(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@RequestBody CartItemRequest request) {
		Integer userId = currentUser.getUserId();
		CartItem item = cartService.addToCart(userId, request.getProductId(), request.getQuantity());
		return ResponseEntity.status(HttpStatus.CREATED).body(item);
	}

	// Cập nhật số lượng sản phẩm trong giỏ
	@PutMapping("/items/{cartItemId}")
	public ResponseEntity<?> updateCartItem(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@PathVariable Integer cartItemId, @RequestBody CartItemRequest request) {
		Integer userId = currentUser.getUserId();
		CartItem updated = cartService.updateQuantity(cartItemId, userId, request.getQuantity());
		if (updated == null) {
			return ResponseEntity.noContent().build(); // quantity <= 0 -> đã xóa
		}
		return ResponseEntity.ok(updated);
	}

	// Xóa sản phẩm khỏi giỏ
	@DeleteMapping("/items/{cartItemId}")
	public ResponseEntity<?> removeCartItem(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@PathVariable Integer cartItemId) {
		Integer userId = currentUser.getUserId();
		cartService.removeCartItem(cartItemId, userId);
		return ResponseEntity.noContent().build();
	}
}