package com.example.shoestore.controller;

import com.example.shoestore.entity.Payment;
import com.example.shoestore.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/{orderId}/status")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Integer orderId) {
        
        return ResponseEntity.ok(paymentService.getPaymentStatusByOrderId(orderId));
    }

    @PostMapping("/{orderId}/confirm")
    public ResponseEntity<?> confirmPayment(@PathVariable Integer orderId) {
        paymentService.confirmPayment(orderId);
        return ResponseEntity.ok("Payment confirmed successfully");
    }

    @PostMapping("/{orderId}/vnpay-url")
    public ResponseEntity<?> createVnpayUrl(@PathVariable Integer orderId) {
        String paymentUrl = paymentService.createVnpayPaymentUrl(orderId);
        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(@RequestParam java.util.Map<String, String> params) {
        paymentService.handleVnpayReturn(params);
        return ResponseEntity.ok("VNPay return handled");
    }
}