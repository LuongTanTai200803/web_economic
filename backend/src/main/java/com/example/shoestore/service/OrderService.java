package com.example.shoestore.service;

<<<<<<< HEAD
import com.example.shoestore.dto.OrderRequest;
import com.example.shoestore.entity.*;
import com.example.shoestore.repository.*;
=======
import com.example.shoestore.controller.AdminController;
import com.example.shoestore.dto.OrderRequest;
import com.example.shoestore.entity.*;
import com.example.shoestore.repository.*;


>>>>>>> 17f3e01 (hoan thien chuc nang thanh toan va lich su don hang)
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

<<<<<<< HEAD
	@Autowired
=======
	private final AdminController adminController;
    @Autowired
>>>>>>> 17f3e01 (hoan thien chuc nang thanh toan va lich su don hang)
	private OrderRepository orderRepository;
	@Autowired
	private OrderItemRepository orderItemRepository;
	@Autowired
	private CartItemRepository cartItemRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ProductRepository productRepository;
<<<<<<< HEAD
=======
	@Autowired
	private PaymentRepository paymentRepository;

    OrderService(AdminController adminController) {
        this.adminController = adminController;
    }
>>>>>>> 17f3e01 (hoan thien chuc nang thanh toan va lich su don hang)

	@Transactional
	public Order createOrder(Integer userId, OrderRequest request) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		// Lấy giỏ hàng của user
		List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
		if (cartItems.isEmpty()) {
			throw new RuntimeException("Giỏ hàng trống, không thể tạo đơn");
		}

		// Tính tổng tiền
		long total = 0;
		for (CartItem item : cartItems) {
			total += item.getProduct().getPrice() * item.getQuantity();
		}

		// Tạo order
		Order order = new Order();
		order.setUser(user);
		order.setTotalAmount(total);
		order.setStatus(Order.OrderStatus.PENDING);
		order.setShippingAddress(request.getShippingAddress());
		order.setPhone(request.getPhone());
		order.setPaymentMethod(request.getPaymentMethod());

		order.setPaymentStatus(Order.OrderPaymentStatus.UNPAID);
		Order savedOrder = orderRepository.save(order);

		// Tạo payment
		Payment payment = new Payment();

		payment.setOrder(savedOrder);
		payment.setPaymentMethod(request.getPaymentMethod());
		payment.setAmount(savedOrder.getTotalAmount());
		payment.setStatus(Payment.PaymentTransactionStatus.PENDING);

		if ("COD".equalsIgnoreCase(request.getPaymentMethod())) {
			payment.setProvider("COD");
		} else if ("VNPAY".equalsIgnoreCase(request.getPaymentMethod())) {
			payment.setProvider("VNPAY");
		}

		paymentRepository.save(payment);


		// Tạo từng order item
		for (CartItem cartItem : cartItems) {
			Product product = cartItem.getProduct();
			OrderItem orderItem = new OrderItem();

			orderItem.setOrder(savedOrder);

			orderItem.setProduct(product);
			orderItem.setQuantity(cartItem.getQuantity());
			orderItem.setPrice(product.getPrice());
			orderItemRepository.save(orderItem);
		}

		// Xóa toàn bộ giỏ hàng
		cartItemRepository.deleteByUserId(userId);


		return savedOrder;

	}

	public List<Order> getOrdersByUserId(Integer userId) {
		return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
	}

	public Order getOrderById(Integer orderId) {
		return orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
	}

	@Transactional
	public Order updateOrderStatus(Integer orderId, String status) {
		Order order = getOrderById(orderId);
		order.setStatus(Order.OrderStatus.valueOf(status));
		return orderRepository.save(order);
	}

	@Transactional
	public void deleteOrder(Integer orderId) {
		orderRepository.deleteById(orderId);
	}

	// Admin: lấy tất cả đơn hàng
	public List<Order> getAllOrders() {
		return orderRepository.findAll();
	}
}