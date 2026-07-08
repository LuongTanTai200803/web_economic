package com.example.shoestore.service;

import com.example.shoestore.dto.CartItemResponse;
import com.example.shoestore.dto.CartResponse;
import com.example.shoestore.entity.CartItem;
import com.example.shoestore.entity.Product;
import com.example.shoestore.entity.User;
import com.example.shoestore.repository.CartItemRepository;
import com.example.shoestore.repository.ProductRepository;
import com.example.shoestore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

	@Autowired
	private CartItemRepository cartItemRepository;
	@Autowired
	private ProductRepository productRepository;
	@Autowired
	private UserRepository userRepository;

	// Lấy giỏ hàng của user
	public CartResponse getCartByUserId(Integer userId) {
		List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
		List<CartItemResponse> itemResponses = cartItems.stream()
				.map(item -> new CartItemResponse(item.getId(), item.getProduct().getId(), item.getProduct().getName(),
						item.getProduct().getPrice(), item.getQuantity(), item.getProduct().getImageUrl()))
				.collect(Collectors.toList());
		Long total = itemResponses.stream().mapToLong(CartItemResponse::getTotalPrice).sum();
		return new CartResponse(itemResponses, total);
	}

	// Thêm sản phẩm vào giỏ (nếu đã có thì tăng số lượng)
	@Transactional
	public CartItem addToCart(Integer userId, Integer productId, Integer quantity) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));

		// Kiểm tra sản phẩm đã có trong giỏ chưa
		CartItem existingItem = cartItemRepository.findByUserIdAndProductId(userId, productId).orElse(null);
		if (existingItem != null) {
			existingItem.setQuantity(existingItem.getQuantity() + quantity);
			return cartItemRepository.save(existingItem);
		} else {
			CartItem newItem = new CartItem(user, product, quantity);
			return cartItemRepository.save(newItem);
		}
	}

	// Cập nhật số lượng
	@Transactional
	public CartItem updateQuantity(Integer cartItemId, Integer userId, Integer newQuantity) {
		CartItem item = cartItemRepository.findById(cartItemId)
				.orElseThrow(() -> new RuntimeException("Cart item not found"));
		// Kiểm tra item thuộc về user hiện tại
		if (!item.getUser().getId().equals(userId)) {
			throw new RuntimeException("You do not own this cart item");
		}
		if (newQuantity <= 0) {
			cartItemRepository.delete(item);
			return null;
		}
		item.setQuantity(newQuantity);
		return cartItemRepository.save(item);
	}

	// Xóa sản phẩm khỏi giỏ
	@Transactional
	public void removeCartItem(Integer cartItemId, Integer userId) {
		CartItem item = cartItemRepository.findById(cartItemId)
				.orElseThrow(() -> new RuntimeException("Cart item not found"));
		if (!item.getUser().getId().equals(userId)) {
			throw new RuntimeException("You do not own this cart item");
		}
		cartItemRepository.delete(item);
	}
}