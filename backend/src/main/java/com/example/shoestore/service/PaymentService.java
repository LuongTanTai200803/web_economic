package com.example.shoestore.service;

import com.example.shoestore.dto.PaymentStatusResponse;
import com.example.shoestore.entity.Order;
import com.example.shoestore.entity.Payment;
import com.example.shoestore.repository.OrderRepository;
import com.example.shoestore.repository.PaymentRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import java.util.HashMap;

@Service
public class PaymentService {

    @Value("${app.vnpay.tmnCode}")
    private String vnpTmnCode;

    @Value("${app.vnpay.hashSecret}")
    private String vnpHashSecret;

    @Value("${app.vnpay.payUrl}")
    private String vnpPayUrl;

    @Value("${app.vnpay.returnUrl}")
    private String vnpReturnUrl;

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    public PaymentStatusResponse getPaymentStatusByOrderId(Integer orderId) {
    Payment payment = paymentRepository.findByOrderId(orderId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));

    PaymentStatusResponse res = new PaymentStatusResponse();

    res.setPaymentId(payment.getId());
    res.setOrderId(payment.getOrder().getId());
    res.setPaymentMethod(payment.getPaymentMethod());
    res.setProvider(payment.getProvider());
    res.setAmount(payment.getAmount());
    res.setStatus(payment.getStatus().name());
    res.setOrderPaymentStatus(payment.getOrder().getPaymentStatus().name());
    res.setTransactionCode(payment.getTransactionCode());
    res.setProviderTransactionId(payment.getProviderTransactionId());
    res.setVnpTxnRef(payment.getVnpTxnRef());
    res.setVnpResponseCode(payment.getVnpResponseCode());
    res.setVnpBankCode(payment.getVnpBankCode());
    res.setVnpPayDate(payment.getVnpPayDate());

    return res;
}

    @Transactional
    public void confirmPayment(Integer orderId) {

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() == Payment.PaymentTransactionStatus.SUCCESS) {
            return;
        }

        payment.setStatus(Payment.PaymentTransactionStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());

        Order order = payment.getOrder();
        order.setPaymentStatus(Order.OrderPaymentStatus.PAID);
        order.setStatus(Order.OrderStatus.PROCESSING);

        paymentRepository.save(payment);
        orderRepository.save(order);
    }

    @Transactional
    public String createVnpayPaymentUrl(Integer orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() != Payment.PaymentTransactionStatus.PENDING) {
            throw new RuntimeException("Payment has already been processed");
        }

        String txnRef = System.currentTimeMillis() + "_" + orderId;

        payment.setTransactionCode(txnRef);
        payment.setVnpTxnRef(txnRef);
        paymentRepository.save(payment);

        String createDate = java.time.LocalDateTime.now()
                .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        Map<String, String> params = new java.util.HashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnpTmnCode);
        params.put("vnp_Amount", String.valueOf(payment.getAmount() * 100));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Thanh toan don hang " + orderId);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", vnpReturnUrl);
        params.put("vnp_IpAddr", "127.0.0.1");
        params.put("vnp_CreateDate", createDate);

        String queryString = buildQueryString(params);
        String secureHash = hmacSHA512(vnpHashSecret, queryString);

        return vnpPayUrl + "?" + queryString + "&vnp_SecureHash=" + secureHash;
    }

    @Transactional
    public void handleVnpayReturn(Map<String, String> params) {
        if (!verifyVnpaySignature(params)) {
            throw new RuntimeException("Invalid VNPay signature");
        }

        String vnpTxnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");

        Payment payment = paymentRepository.findByVnpTxnRef(vnpTxnRef)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setProviderTransactionId(params.get("vnp_TransactionNo"));
        payment.setVnpResponseCode(responseCode);
        payment.setVnpBankCode(params.get("vnp_BankCode"));
        payment.setVnpPayDate(params.get("vnp_PayDate"));

        Order order = payment.getOrder();

        if ("00".equals(responseCode)) {
            payment.setStatus(Payment.PaymentTransactionStatus.SUCCESS);
            payment.setPaidAt(java.time.LocalDateTime.now());

            order.setPaymentStatus(Order.OrderPaymentStatus.PAID);
            order.setStatus(Order.OrderStatus.PROCESSING);
        } else {
            payment.setStatus(Payment.PaymentTransactionStatus.FAILED);
            order.setPaymentStatus(Order.OrderPaymentStatus.FAILED);
        }

        paymentRepository.save(payment);
        orderRepository.save(order);
    }

    private boolean verifyVnpaySignature(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");

        if (receivedHash == null || receivedHash.isBlank()) {
            return false;
        }

        Map<String, String> filteredParams = new HashMap<>(params);
        filteredParams.remove("vnp_SecureHash");
        filteredParams.remove("vnp_SecureHashType");

        String queryString = buildQueryString(filteredParams);
        String calculatedHash = hmacSHA512(vnpHashSecret, queryString);

        return calculatedHash.equalsIgnoreCase(receivedHash);
    }

    private String hmacSHA512(String key, String data) {
        try {
            javax.crypto.Mac hmac512 = javax.crypto.Mac.getInstance("HmacSHA512");
            javax.crypto.spec.SecretKeySpec secretKey =
                    new javax.crypto.spec.SecretKeySpec(key.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);

            byte[] bytes = hmac512.doFinal(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));

            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }
            return hash.toString();
        } catch (Exception e) {
            throw new RuntimeException("Cannot sign VNPay data", e);
        }
    }

    private String buildQueryString(Map<String, String> params) {
        return params.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> entry.getKey() + "=" + java.net.URLEncoder.encode(entry.getValue(), java.nio.charset.StandardCharsets.UTF_8))
                .collect(java.util.stream.Collectors.joining("&"));
    }


}