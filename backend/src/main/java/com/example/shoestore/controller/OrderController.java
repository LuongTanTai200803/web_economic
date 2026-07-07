package com.example.shoestore.controller;

import com.example.shoestore.dto.OrderDTO;
import com.example.shoestore.dto.OrderItemDTO;
import com.example.shoestore.dto.OrderRequest;
import com.example.shoestore.entity.Order;
import com.example.shoestore.entity.OrderItem;
import com.example.shoestore.security.UserDetailsImpl;
import com.example.shoestore.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

	@Autowired
	private OrderService orderService;

	// Helper chuyển đổi Order -> OrderDTO
	private OrderDTO convertToDTO(Order order) {
		List<OrderItemDTO> itemDTOs = order.getOrderItems().stream().map(item -> new OrderItemDTO(item.getId(),
				item.getProduct().getId(), item.getProduct().getName(), item.getQuantity(), item.getPrice()))
				.collect(Collectors.toList());

		return new OrderDTO(order.getId(), order.getOrderDate(), order.getTotalAmount(), order.getStatus().name(),
				order.getShippingAddress(), order.getPhone(), order.getPaymentMethod(), itemDTOs);
	}

	// 1. Tạo đơn hàng từ giỏ hàng
	@PostMapping
	public ResponseEntity<?> createOrder(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@RequestBody OrderRequest request) {
		try {
			Order order = orderService.createOrder(currentUser.getUserId(), request);
			return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(order));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// 2. Lấy lịch sử đơn hàng của user hiện tại
	@GetMapping
	public ResponseEntity<List<OrderDTO>> getUserOrders(@AuthenticationPrincipal UserDetailsImpl currentUser) {
		List<Order> orders = orderService.getOrdersByUserId(currentUser.getUserId());
		List<OrderDTO> orderDTOs = orders.stream().map(this::convertToDTO).collect(Collectors.toList());
		return ResponseEntity.ok(orderDTOs);
	}

	// 3. Lấy chi tiết một đơn hàng (kiểm tra quyền sở hữu hoặc admin)
	@GetMapping("/{orderId}")
	public ResponseEntity<?> getOrderById(@AuthenticationPrincipal UserDetailsImpl currentUser,
			@PathVariable Integer orderId) {
		Order order = orderService.getOrderById(orderId);
		// Cho phép nếu là chủ đơn hoặc admin
		boolean isOwner = order.getUser().getId().equals(currentUser.getUserId());
		boolean isAdmin = currentUser.getRole().equals("ADMIN");
		if (!isOwner && !isAdmin) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xem đơn hàng này");
		}
		return ResponseEntity.ok(convertToDTO(order));
	}

	// 4. Cập nhật trạng thái đơn hàng (chỉ admin)
	@PutMapping("/{orderId}/status")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> updateOrderStatus(@PathVariable Integer orderId, @RequestParam String status) {
		try {
			Order updated = orderService.updateOrderStatus(orderId, status.toUpperCase());
			return ResponseEntity.ok(convertToDTO(updated));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// 5. Xoá đơn hàng (chỉ admin)
	@DeleteMapping("/{orderId}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> deleteOrder(@PathVariable Integer orderId) {
		orderService.deleteOrder(orderId);
		return ResponseEntity.noContent().build();
	}

	// 6. (Admin) Lấy tất cả đơn hàng
	@GetMapping("/admin/all")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<OrderDTO>> getAllOrders() {
		List<Order> orders = orderService.getAllOrders();
		List<OrderDTO> orderDTOs = orders.stream().map(this::convertToDTO).collect(Collectors.toList());
		return ResponseEntity.ok(orderDTOs);
	}
}