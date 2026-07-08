// AdminController.java
package com.example.shoestore.controller;

import com.example.shoestore.dto.AdminStatsDTO;
import com.example.shoestore.entity.Order;
import com.example.shoestore.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

	@Autowired
	private OrderRepository orderRepository;

	@GetMapping("/stats")
	public AdminStatsDTO getStats() {
		long totalOrders = orderRepository.count();
		long totalCompletedOrders = orderRepository.countByStatus(Order.OrderStatus.COMPLETED);
		long pendingOrders = orderRepository.countByStatus(Order.OrderStatus.PENDING);
		Long revenue = orderRepository.sumTotalAmountByCompletedOrders();
		if (revenue == null)
			revenue = 0L;
		return new AdminStatsDTO(totalOrders, totalCompletedOrders, revenue, pendingOrders);
	}
}