package com.example.shoestore.dto;

public class LoginResponse {
	private String token;
	private Integer userId;
	private String role;

	public LoginResponse(String token, Integer userId, String role) {
		this.token = token;
		this.userId = userId;
		this.role = role;
	}

	// getters
	public String getToken() {
		return token;
	}

	public Integer getUserId() {
		return userId;
	}

	public String getRole() {
		return role;
	}
}