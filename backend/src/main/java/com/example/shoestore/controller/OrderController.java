package com.example.shoestore.controller;

import com.example.shoestore.dto.OrderRequest;
import com.example.shoestore.entity.CartItem;
import com.example.shoestore.entity.Order;
import com.example.shoestore.entity.OrderItem;
import com.example.shoestore.entity.User;
import com.example.shoestore.repository.CartItemRepository;
import com.example.shoestore.repository.OrderItemRepository;
import com.example.shoestore.repository.OrderRepository;
import com.example.shoestore.repository.UserRepository;
import com.example.shoestore.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

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

    // 1. Lấy lịch sử đơn hàng của user
    @GetMapping
    public ResponseEntity<?> getUserOrders() {
        Integer userId = getCurrentUserId();
        if (userId == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        // orderRepository đã có sẵn method này từ file OrderRepository.java
        List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);
        return ResponseEntity.ok(orders);
    }

    // 2. Tạo đơn hàng từ giỏ hàng hiện tại
    @PostMapping
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        Integer userId = getCurrentUserId();
        if (userId == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Giỏ hàng của bạn đang trống"));
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Không tìm thấy thông tin người dùng");
        }

        // Tính tổng tiền từ giỏ hàng
        Long totalAmount = 0L;
        List<OrderItem> orderItems = new ArrayList<>();

        // Tạo Order mới
        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setShippingAddress(request.getShippingAddress());
        order.setPhone(request.getPhone());
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD");

        for (CartItem item : cartItems) {
            totalAmount += item.getProduct().getPrice() * item.getQuantity();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(item.getProduct().getPrice());
            orderItems.add(orderItem);
        }

        order.setTotalAmount(totalAmount);

        // Lưu đơn hàng và chi tiết
        Order savedOrder = orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);

        // Xóa giỏ hàng sau khi đặt thành công (method đã có ở file CartItemRepository)
        cartItemRepository.deleteByUserId(userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }
}