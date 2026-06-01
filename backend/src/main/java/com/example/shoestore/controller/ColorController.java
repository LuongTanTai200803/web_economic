package com.example.shoestore.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.shoestore.repository.ColorRepository;
import com.example.shoestore.entity.Color;
@RestController
@RequestMapping("/api/colors")
public class ColorController {
	@Autowired
	private ColorRepository colorRepository;

	@GetMapping
	public List<Color> getAll() {
		return colorRepository.findAll();
	}
}
