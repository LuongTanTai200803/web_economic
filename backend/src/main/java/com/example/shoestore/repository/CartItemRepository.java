package com.example.shoestore.repository;

import com.example.shoestore.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

	// Lấy toàn bộ giỏ hàng của user
	List<CartItem> findByUserId(Integer userId);

	// Tìm một sản phẩm trong giỏ của user (để cập nhật số lượng hoặc xóa)
	Optional<CartItem> findByUserIdAndProductId(Integer userId, Integer productId);

	// Xóa toàn bộ giỏ hàng của user (sau khi thanh toán)
	@Transactional
	@Modifying
	@Query("DELETE FROM CartItem c WHERE c.user.id = :userId")
	void deleteByUserId(@Param("userId") Integer userId);
}