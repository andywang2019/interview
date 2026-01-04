package com.itlaoqi.babytunseckill.service;

import com.alibaba.fastjson2.JSON;
import com.itlaoqi.babytunseckill.dao.OrderDAO;
import com.itlaoqi.babytunseckill.entity.Order;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;
import jakarta.annotation.Resource;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

import jakarta.annotation.Resource;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;


//一个 partition，在同一个 consumer group 里，只能被一个 consumer 消费。
//Kafka 的 offset 永远是：<groupId, topic, partition> 三元组唯一绑定
@Component
public class OrderConsumer {
    @Resource
    private OrderDAO orderDAO;

    @KafkaListener(
            topics = "new-order-topic",//,        // 替代 RabbitMQ 的 queue-order
           // groupId = "order-consumer"     // 消费组
    concurrency = "3"
    )


    public void handleMessage( ConsumerRecord<String, String> record,
                              Acknowledgment ack) {
       // Map<String, Object> data = JSON.parseObject(msg, Map.class);
        Map<String, Object> data =
                JSON.parseObject(record.value(), Map.class);
        System.out.println("=======获取到订单数据: " + data + "==============");
        System.out.printf(
                "Thread=%s, topic=%s, partition=%d, offset=%d%n",
                Thread.currentThread().getName(),
                record.topic(),
                record.partition(),
                record.offset()
        );



        try {
            //int a =1/0;
            // 模拟处理业务，例如支付/物流/日志等
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            Order order = new Order();
            order.setOrderNo(data.get("orderNo").toString());
            order.setOrderStatus(0);
            order.setUserid(data.get("userid").toString());
            order.setRecvName("xxx");
            order.setRecvMobile("1393310xxxx");
            order.setRecvAddress("xxxxxxxxxx");
            order.setAmout(19.8f);
            order.setPostage(0f);
            order.setCreateTime(new Date());
            orderDAO.insert(order);
            // 手动提交 offset
//
            ack.acknowledge(); //springboot wrap spring后台有可能提交,也有可能没提交成功 -> karfka.commitSysnc()



            System.out.println(data.get("orderNo") + "订单已创建");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
