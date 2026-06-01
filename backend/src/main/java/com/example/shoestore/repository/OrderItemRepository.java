package com.example.shoestore.repository;

import com.example.shoestore.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    
    // Lấy danh sách sản phẩm theo đơn hàng (dùng khi hiển thị chi tiết đơn)
    List<OrderItem> findByOrderId(Integer orderId);
}