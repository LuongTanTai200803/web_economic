package com.example.shoestore.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.shoestore.repository.BrandRepository;
import com.example.shoestore.entity.Brand;
@RestController
@RequestMapping("/api/brands")
public class BrandController {
    @Autowired private BrandRepository brandRepository;
    @GetMapping
    public List<Brand> getAll() { return brandRepository.findAll(); }
}
