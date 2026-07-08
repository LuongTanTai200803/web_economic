package com.example.shoestore.entity;

import java.time.LocalDateTime;
import jakarta.persistence.EnumType;
import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// CREATE TABLE payments (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     order_id INT NOT NULL,

//     payment_method VARCHAR(50) NOT NULL,
//     provider VARCHAR(50),

//     amount DECIMAL(12,0) NOT NULL,

//     status ENUM(
//         'PENDING',
//         'SUCCESS',
//         'FAILED',
//         'CANCELLED'
//     ) DEFAULT 'PENDING',

//     transaction_code VARCHAR(100),
//     provider_transaction_id VARCHAR(100),

//     paid_at TIMESTAMP NULL,

//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         ON UPDATE CURRENT_TIMESTAMP,

//     FOREIGN KEY (order_id)
//         REFERENCES orders(id)
//         ON DELETE CASCADE
// );

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod;

    @Column(length = 50)
    private String provider;

    @Column(nullable = false)
    private Long amount;

    @Enumerated(EnumType.STRING)
    private PaymentTransactionStatus status = PaymentTransactionStatus.PENDING;

    @Column(name = "transaction_code", length = 100)
    private String transactionCode;

    @Column(name = "provider_transaction_id", length = 100)
    private String providerTransactionId;


    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "vnp_txn_ref", unique = true, length = 100)
    private String vnpTxnRef;

    @Column(name = "vnp_response_code", length = 20)
    private String vnpResponseCode;

    @Column(name = "vnp_bank_code", length = 50)
    private String vnpBankCode;

    @Column(name = "vnp_pay_date", length = 20)
    private String vnpPayDate;

    public Payment() {
    }
    public Payment(Order order, String paymentMethod, String provider, Long amount, PaymentTransactionStatus status,
            String transactionCode, String providerTransactionId, LocalDateTime paidAt) {
        this.order = order;
        this.paymentMethod = paymentMethod;
        this.provider = provider;
        this.amount = amount;
        this.status = status;
        this.transactionCode = transactionCode;
        this.providerTransactionId = providerTransactionId;
        this.paidAt = paidAt;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public Order getOrder() {
        return order;
    }
    public void setOrder(Order order) {
        this.order = order;
    }
    public String getPaymentMethod() {
        return paymentMethod;
    }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    public String getProvider() {
        return provider;
    }
    public void setProvider(String provider) {
        this.provider = provider;
    }
    public Long getAmount() {
        return amount;
    }
    public void setAmount(Long amount) {
        this.amount = amount;
    }
    public PaymentTransactionStatus getStatus() {
        return status;
    }
    public void setStatus(PaymentTransactionStatus status) {
        this.status = status;
    }
    public String getTransactionCode() {
        return transactionCode;
    }
    public void setTransactionCode(String transactionCode) {
        this.transactionCode = transactionCode;
    }
    public String getProviderTransactionId() {

        return providerTransactionId;
    }
    public void setProviderTransactionId(String providerTransactionId) {
        this.providerTransactionId = providerTransactionId;
    }
    public LocalDateTime getPaidAt() {
        return paidAt;
    }
    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public enum PaymentTransactionStatus {
        PENDING,
        SUCCESS,
        FAILED,
        CANCELLED
    }

    public void setVnpResponseCode(String responseCode) {
        this.vnpResponseCode = responseCode;
    }
    public void setVnpBankCode(String bankCode) {
        this.vnpBankCode = bankCode;
    }
    public void setVnpPayDate(String payDate) {
        this.vnpPayDate = payDate;
    }
    public void setVnpTxnRef(String txnRef) {
        this.vnpTxnRef = txnRef;
    }
    
    public String getVnpResponseCode() {
        return vnpResponseCode;
    }
    public String getVnpBankCode() {
        return vnpBankCode;
    }
    public String getVnpPayDate() {
        return vnpPayDate;
    }
    public String getVnpTxnRef() {
        return vnpTxnRef;
    }

}
