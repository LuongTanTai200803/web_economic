package com.example.shoestore.dto;

import java.util.List;

public class CartResponse {
	private List<CartItemResponse> items;
	private Long totalAmount;

	public CartResponse(List<CartItemResponse> items, Long totalAmount) {
		this.items = items;
		this.totalAmount = totalAmount;
	}

	// getters
	public List<CartItemResponse> getItems() {
		return items;
	}

	public Long getTotalAmount() {
		return totalAmount;
	}
}