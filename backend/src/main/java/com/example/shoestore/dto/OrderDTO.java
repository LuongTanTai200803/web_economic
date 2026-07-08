package com.example.shoestore.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {
	private Integer id;
	private LocalDateTime orderDate;
	private Long totalAmount;
	private String status;
	private String shippingAddress;
	private String phone;
	private String paymentMethod;
	private List<OrderItemDTO> orderItems;

	// Constructor
	public OrderDTO(Integer id, LocalDateTime orderDate, Long totalAmount, String status, String shippingAddress,
			String phone, String paymentMethod, List<OrderItemDTO> orderItems) {
		this.id = id;
		this.orderDate = orderDate;
		this.totalAmount = totalAmount;
		this.status = status;
		this.shippingAddress = shippingAddress;
		this.phone = phone;
		this.paymentMethod = paymentMethod;
		this.orderItems = orderItems;
	}

	// Getters
	public Integer getId() {
		return id;
	}

	public LocalDateTime getOrderDate() {
		return orderDate;
	}

	public Long getTotalAmount() {
		return totalAmount;
	}

	public String getStatus() {
		return status;
	}

	public String getShippingAddress() {
		return shippingAddress;
	}

	public String getPhone() {
		return phone;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public List<OrderItemDTO> getOrderItems() {
		return orderItems;
	}
}