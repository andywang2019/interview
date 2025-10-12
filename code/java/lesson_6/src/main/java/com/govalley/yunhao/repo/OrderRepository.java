package com.govalley.yunhao.repo;

import com.govalley.yunhao.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // 可选（JpaRepository会自动加上）
public interface OrderRepository extends JpaRepository<Order, Long> {
    // 你可以在这里定义自定义查询方法，比如：
   // Order findByOrderNo(String orderNo);
}
