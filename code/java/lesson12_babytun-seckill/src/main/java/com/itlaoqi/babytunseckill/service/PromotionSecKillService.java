package com.itlaoqi.babytunseckill.service;

import com.itlaoqi.babytunseckill.dao.OrderDAO;
import com.itlaoqi.babytunseckill.dao.PromotionSecKillDAO;
import com.itlaoqi.babytunseckill.entity.Order;
import com.itlaoqi.babytunseckill.entity.PromotionSecKill;
import com.itlaoqi.babytunseckill.service.exception.SecKillException;

import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import org.springframework.kafka.core.KafkaTemplate;
import com.alibaba.fastjson2.JSON;
import jakarta.annotation.Resource;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@Service
public class PromotionSecKillService {
    @Resource
    private PromotionSecKillDAO promotionSecKillDAO;
    @Resource
    private RedisTemplate redisTemplate;
   // @Resource //RabbitMQ客户端
   // private RabbitTemplate rabbitTemplate;


    @Resource //Kafkaclient
    private KafkaTemplate<String, String> kafkaTemplate;

    @Resource
    private OrderDAO orderDAO;
    public void processSecKill(Long psId, String userid, Integer num) throws SecKillException {
        PromotionSecKill ps = promotionSecKillDAO.findById(psId);
        if (ps == null) {
            //秒杀活动不存在
            throw new SecKillException("秒杀活动不存在");
        }
        if (ps.getStatus() == 0) {
            throw new SecKillException("秒杀活动还未开始");
        } else if (ps.getStatus() == 2) {
            throw new SecKillException("秒杀活动已经结束");
        }
        Long goodsId = (Long) redisTemplate.opsForList().leftPop("seckill:count:" + ps.getPsId());
        if (goodsId != null) {
            //判断是否已经抢购过
            boolean isExisted = redisTemplate.opsForSet().isMember("seckill:users:" + ps.getPsId(), userid);
           // if (!isExisted) {
           //     System.out.println("恭喜您，抢到商品啦。快去下单吧");
            //    redisTemplate.opsForSet().add("seckill:users:" + ps.getPsId(), userid);
           // }else{
            //    redisTemplate.opsForList().rightPush("seckill:count:" + ps.getPsId(), ps.getGoodsId());
             //   throw new SecKillException("抱歉，您已经参加过此活动，请勿重复抢购！");
            //}
        } else {
            throw new SecKillException("抱歉，该商品已被抢光，下次再来吧！！");
        }


    }
    public String direct_processSecKill(Long psId, String userid, Integer num) throws SecKillException {
        PromotionSecKill ps = promotionSecKillDAO.findById(psId);
        if (ps == null) {
            //秒杀活动不存在
            throw new SecKillException("秒杀活动不存在");
        }
        if (ps.getStatus() == 0) {
            throw new SecKillException("秒杀活动还未开始");
        } else if (ps.getStatus() == 2) {
            throw new SecKillException("秒杀活动已经结束");
        }
        if(ps.getPsCount()>0)
        ps.setPsCount(ps.getPsCount()-1);
        promotionSecKillDAO.update(ps);
        Order order = new Order();
        String orderNo=UUID.randomUUID().toString();
        order.setOrderNo(orderNo);
        order.setOrderStatus(0);
        order.setUserid(userid);
        order.setRecvName("xxx");
        order.setRecvMobile("1393310xxxx");
        order.setRecvAddress("xxxxxxxxxx");
        order.setAmout(19.8f);
        order.setPostage(0f);
        order.setCreateTime(new Date());
        orderDAO.insert(order);
        return orderNo;




    }
/*
    public String RMQ_sendOrderToQueue(String userid) {
        System.out.println("准备向队列发送信息");
        //订单基本信息
        Map data = new HashMap();
        data.put("userid", userid);
        String orderNo = UUID.randomUUID().toString();
        data.put("orderNo", orderNo);
        //附加额外的订单信息
        rabbitTemplate.convertAndSend("exchange-order" , null , data);
        return orderNo;
    }
    */


    public String sendOrderToQueue(String userid) {
        System.out.println("准备向 Kafka 发送信息");

        Map<String, Object> data = new HashMap<>();
        data.put("userid", userid);
        String orderNo = UUID.randomUUID().toString();
        data.put("orderNo", orderNo);

        // 数据转 JSON 字符串（Kafka 推荐发 JSON）
        String json = JSON.toJSONString(data);
        System.out.println(Thread.currentThread()+"in main.\n");
        // Kafka 发送消息到 topic
        Future<SendResult<String, String>> res =
                kafkaTemplate.send("new-order-topic",UUID.randomUUID().toString(), json)//; //后头sender线程
                        .whenComplete((result, ex) -> {  //callback是在sender线程执行的
                            if (ex != null) {
                                // 发送失败
                                System.out.println(ex);
                            } else {
                                System.out.println("in sender"+Thread.currentThread());
                                // 发送成功
                                RecordMetadata md = result.getRecordMetadata();
                                System.out.println(md.topic()+":"+md.partition()+":"+md.offset());
                            }
                        });
        //try {
   // SendResult<String, String> result = res.get();
    //ProducerRecord pd=result.getProducerRecord();
   // System.out.println(pd.partition());
   // RecordMetadata metadata = result.getRecordMetadata();
   // System.out.println(metadata.partition());


        return orderNo;
    }

    public Order checkOrder(String orderNo){
        Order order = orderDAO.findByOrderNo(orderNo);
        return order;
    }
}
