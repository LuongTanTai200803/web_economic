package com.example.shoestore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "colors")
public class Color {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(nullable = false, unique = true, length = 50)
	private String name;

	public Color() {
	}

	public Color(String name) {
		this.name = name;
	}

	// Getters and Setters
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}