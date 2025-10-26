package com.govalley.yunhao.controller;

import com.govalley.yunhao.entity.Order;
import com.govalley.yunhao.repo.OrderRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@Tag(name = "订单接口", description = "管理订单的创建与查询")
public class OrderController {

    private final OrderRepository repo;

    public OrderController(OrderRepository repo) {
    	System.out.print("test OrderController ");
        this.repo = repo;
    }

    @Operation(summary = "创建订单", description = "提交一个新的订单")
    @PostMapping
    public Order create(@RequestBody Order order) {
        return repo.save(order);
    }
    @Operation(summary = "update订单", description = "更新订单")
    @PutMapping
    public Order update(@RequestBody Order order) {
        return repo.saveAndFlush(order);
    }

    @Operation(summary = "查询订单列表", description = "获取所有订单信息")
    @GetMapping
    public List<Order> findAll() {
        return repo.findAll();
    }
    @Operation(summary = "查询订单", description = "获取id为特定编号的订单信息")
    @GetMapping("/{id}/detail")  //orders/2/detail
    public Order findById(@PathVariable("id") Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }
    
   
}