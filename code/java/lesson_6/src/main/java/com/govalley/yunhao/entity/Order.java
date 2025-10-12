package com.govalley.yunhao.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity                 // 声明该类为 JPA 实体类
@Table(name = "orders") // 指定数据库表名为 orders
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 自增主键
    private Long id;

    @Column(nullable = false, length = 50)
    private String orderNo;   // 订单号

    @Column(nullable = false)
    private Double totalAmount; // 总金额

    @Column(nullable = false)
    private String status;     // 订单状态（如 PENDING, PAID, SHIPPED）

    @Column(nullable = false)
    private LocalDateTime createdAt; // 创建时间

    @Column
    private LocalDateTime updatedAt; // 更新时间

    // ✅ 构造函数
    public Order() {
        this.createdAt = LocalDateTime.now();
    }

    // ✅ Getter / Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
}
