package com.example.shoestore.repository;

import com.example.shoestore.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

	// Tìm kiếm theo tên chứa từ khóa (không phân biệt hoa thường)
	Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

	// Lọc theo thương hiệu
	Page<Product> findByBrandId(Integer brandId, Pageable pageable);

	// Lọc theo màu sắc
	Page<Product> findByColorId(Integer colorId, Pageable pageable);

	// Lọc theo thương hiệu và màu sắc
	Page<Product> findByBrandIdAndColorId(Integer brandId, Integer colorId, Pageable pageable);

	// Lấy sản phẩm mới nhất (giới hạn số lượng)
	@Query("SELECT p FROM Product p ORDER BY p.createdAt DESC")
	Page<Product> findTopNewest(Pageable pageable);

	// Thống kê tổng số sản phẩm
	long count();
}