package com.example.shoestore.controller;

import com.example.shoestore.entity.Product;
import com.example.shoestore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Lấy danh sách sản phẩm có phân trang, lọc, sắp xếp và tìm kiếm
     * Ví dụ request:
     * GET /api/products?brandId=1&colorId=2&sortBy=price_desc&page=0&size=10&keyword=giay
     */
    @GetMapping
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(required = false) Integer brandId,
            @RequestParam(required = false) Integer colorId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Page<Product> products = productService.getProducts(brandId, colorId, keyword, sortBy, page, size);
        return ResponseEntity.ok(products);
    }

    /**
     * Lấy chi tiết một sản phẩm theo id
     * GET /api/products/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
}