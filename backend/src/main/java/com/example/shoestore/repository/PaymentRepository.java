package com.example.shoestore.repository;

import com.example.shoestore.entity.Payment;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Optional<Payment> findByOrderId(Integer orderId);

    Optional<Payment> findByTransactionCode(String transactionNo);

    Optional<Payment> findByVnpTxnRef(String vnpTxnRef);
}
