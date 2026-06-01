package com.example.shoestore.service;

import com.example.shoestore.entity.Product;
import com.example.shoestore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    /**
     * Lấy danh sách sản phẩm có lọc, phân trang và sắp xếp
     * @param brandId   id thương hiệu (có thể null)
     * @param colorId   id màu sắc (có thể null)
     * @param keyword   từ khóa tìm kiếm theo tên (có thể null hoặc rỗng)
     * @param sortBy    "price_asc", "price_desc", "newest" (mặc định "id")
     * @param page      số trang (bắt đầu từ 0)
     * @param size      số lượng mỗi trang
     * @return Page<Product>
     */
    public Page<Product> getProducts(Integer brandId, Integer colorId, String keyword,
                                     String sortBy, int page, int size) {
        Sort sort = Sort.by("id").ascending();
        if (sortBy != null) {
            switch (sortBy) {
                case "price_asc":
                    sort = Sort.by("price").ascending();
                    break;
                case "price_desc":
                    sort = Sort.by("price").descending();
                    break;
                case "newest":
                    sort = Sort.by("createdAt").descending();
                    break;
                default:
                    sort = Sort.by("id").ascending();
            }
        }
        Pageable pageable = PageRequest.of(page, size, sort);

        // Ưu tiên tìm kiếm theo keyword
        if (keyword != null && !keyword.trim().isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(keyword, pageable);
        }
        // Lọc theo brand và color
        if (brandId != null && colorId != null) {
            return productRepository.findByBrandIdAndColorId(brandId, colorId, pageable);
        } else if (brandId != null) {
            return productRepository.findByBrandId(brandId, pageable);
        } else if (colorId != null) {
            return productRepository.findByColorId(colorId, pageable);
        } else {
            return productRepository.findAll(pageable);
        }
    }

    /**
     * Lấy chi tiết sản phẩm theo id
     * @param id id sản phẩm
     * @return Product (ném exception nếu không tìm thấy)
     */
    public Product getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + id));
    }
}