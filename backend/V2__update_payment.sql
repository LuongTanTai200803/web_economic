ALTER TABLE orders
ADD COLUMN payment_status ENUM(
    'UNPAID',
    'PAID',
    'FAILED',
    'REFUNDED'
) DEFAULT 'UNPAID';

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    payment_method VARCHAR(50) NOT NULL,      -- COD, VNPAY
    provider VARCHAR(50) NOT NULL,            -- COD, VNPAY

    amount DECIMAL(12,0) NOT NULL,

    status ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED',
        'CANCELLED'
    ) DEFAULT 'PENDING',

    transaction_code VARCHAR(100),            -- mã giao dịch do hệ thống sinh
    provider_transaction_id VARCHAR(100),     -- mã giao dịch từ VNPay

    vnp_txn_ref VARCHAR(100) UNIQUE,          -- vnp_TxnRef
    vnp_response_code VARCHAR(20),            -- vnp_ResponseCode
    vnp_bank_code VARCHAR(50),                -- vnp_BankCode
    vnp_pay_date VARCHAR(20),                 -- vnp_PayDate

    paid_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);
