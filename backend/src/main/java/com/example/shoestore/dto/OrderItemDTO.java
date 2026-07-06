package com.example.shoestore.dto;

public class OrderItemDTO {
	private Integer id;
	private Integer productId;
	private String productName;
	private Integer quantity;
	private Long price;

	public OrderItemDTO(Integer id, Integer productId, String productName, Integer quantity, Long price) {
		this.id = id;
		this.productId = productId;
		this.productName = productName;
		this.quantity = quantity;
		this.price = price;
	}

	// Getters
	public Integer getId() {
		return id;
	}

	public Integer getProductId() {
		return productId;
	}

	public String getProductName() {
		return productName;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public Long getPrice() {
		return price;
	}
}	