package com.example.shoestore.dto;

public class CartItemRequest {
	private Integer productId;
	private Integer quantity;

	// Constructor mặc định
	public CartItemRequest() {
	}

	// getters, setters
	public Integer getProductId() {
		return productId;
	}

	public void setProductId(Integer productId) {
		this.productId = productId;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
}