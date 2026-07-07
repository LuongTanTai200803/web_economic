// AdminStatsDTO.java
package com.example.shoestore.dto;

public class AdminStatsDTO {
	private long totalOrders;
	private long totalCompletedOrders;
	private long totalRevenue;
	private long pendingOrders;

	public AdminStatsDTO(long totalOrders, long totalCompletedOrders, long totalRevenue, long pendingOrders) {
		this.totalOrders = totalOrders;
		this.totalCompletedOrders = totalCompletedOrders;
		this.totalRevenue = totalRevenue;
		this.pendingOrders = pendingOrders;
	}
	// getters

	public long getTotalOrders() {
		return totalOrders;
	}

	public long getTotalCompletedOrders() {
		return totalCompletedOrders;
	}

	public long getTotalRevenue() {
		return totalRevenue;
	}

	public long getPendingOrders() {
		return pendingOrders;
	}
}