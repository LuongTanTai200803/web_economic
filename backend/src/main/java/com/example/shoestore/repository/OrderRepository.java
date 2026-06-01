package com.example.shoestore.repository;

import com.example.shoestore.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    
    // Lấy danh sách đơn hàng của một user (lịch sử đơn hàng)
    List<Order> findByUserIdOrderByOrderDateDesc(Integer userId);
    
    // Thống kê: tổng số đơn hàng (ghi đè phương thức count có sẵn của JPA, có thể không cần)
    // long count(); // JpaRepository đã có, không cần khai báo lại
    
    // Thống kê: tổng số đơn hàng theo trạng thái (dùng cho bất kỳ status nào: PENDING, COMPLETED, ...)
    long countByStatus(Order.OrderStatus status);
    
    // Thống kê: tổng doanh thu từ các đơn đã hoàn thành
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'COMPLETED'")
    Long sumTotalAmountByCompletedOrders();
    
    // (Không cần khai báo lại countByStatus)
}