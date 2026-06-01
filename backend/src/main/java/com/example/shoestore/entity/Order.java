package com.example.shoestore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "order_date")
	private LocalDateTime orderDate;

	@Column(name = "total_amount", nullable = false)
	private Long totalAmount;

	@Enumerated(EnumType.STRING)
	@Column(columnDefinition = "ENUM('PENDING','PROCESSING','COMPLETED','CANCELLED') DEFAULT 'PENDING'")
	private OrderStatus status;

	@Column(name = "shipping_address", nullable = false, length = 255)
	private String shippingAddress;

	@Column(nullable = false, length = 20)
	private String phone;

	@Column(name = "payment_method", length = 50)
	private String paymentMethod;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderItem> orderItems = new ArrayList<>();

	public Order() {
	}

	public Order(User user, Long totalAmount, OrderStatus status, String shippingAddress, String phone,
			String paymentMethod) {
		this.user = user;
		this.totalAmount = totalAmount;
		this.status = status;
		this.shippingAddress = shippingAddress;
		this.phone = phone;
		this.paymentMethod = paymentMethod;
		this.orderDate = LocalDateTime.now();
	}

	// Helper methods
	public void addOrderItem(OrderItem item) {
		orderItems.add(item);
		item.setOrder(this);
	}

	// Getters and Setters
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public LocalDateTime getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(LocalDateTime orderDate) {
		this.orderDate = orderDate;
	}

	public Long getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Long totalAmount) {
		this.totalAmount = totalAmount;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}

	public String getShippingAddress() {
		return shippingAddress;
	}

	public void setShippingAddress(String shippingAddress) {
		this.shippingAddress = shippingAddress;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public List<OrderItem> getOrderItems() {
		return orderItems;
	}

	public void setOrderItems(List<OrderItem> orderItems) {
		this.orderItems = orderItems;
	}

	public enum OrderStatus {
		PENDING, PROCESSING, COMPLETED, CANCELLED
	}
}