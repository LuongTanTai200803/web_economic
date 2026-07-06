package com.example.shoestore.dto;

public class CartItemResponse {
	private Integer id;
	private Integer productId;
	private String productName;
	private Long price;
	private Integer quantity;
	private Long totalPrice; // price * quantity
	private String productImage;

	public CartItemResponse(Integer id, Integer productId, String productName, Long price, Integer quantity,
			String productImage) {
		this.id = id;
		this.productId = productId;
		this.productName = productName;
		this.price = price;
		this.quantity = quantity;
		this.totalPrice = price * quantity;
		this.productImage = productImage;
	}

	// getters (không cần setters)
	public Integer getId() {
		return id;
	}

	public String getProductImage() {
		return productImage;
	}

	public void setProductImage(String productImage) {
		this.productImage = productImage;
	}

	public Integer getProductId() {
		return productId;
	}

	public String getProductName() {
		return productName;
	}

	public Long getPrice() {
		return price;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public Long getTotalPrice() {
		return totalPrice;
	}
}