package com.itlaoqi.babytunseckill.controller;

import com.itlaoqi.babytunseckill.dao.OrderDAO;
import com.itlaoqi.babytunseckill.dao.PromotionSecKillDAO;
import com.itlaoqi.babytunseckill.entity.Order;
import com.itlaoqi.babytunseckill.entity.PromotionSecKill;
import com.itlaoqi.babytunseckill.service.PromotionSecKillService;
import com.itlaoqi.babytunseckill.service.exception.SecKillException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import jakarta.annotation.Resource;

import java.util.*;

@Controller
public class SecKillController {
    @Autowired
    private ApplicationContext applicationContext;
    @Resource
    private OrderDAO orderDAO;

    @Resource
    PromotionSecKillService promotionSecKillService;
    @RequestMapping("/seckill")
    @ResponseBody
    public Map processSecKill(Long psid , String userid){
        String[] names = applicationContext.getBeanNamesForType(SecKillController.class);
        System.out.println( "SecKillController name:"+Arrays.toString(names));
        System.out.println("current thread"+Thread.currentThread().getName());
       // System.out.println("psid"+psid);
        psid=Long.parseLong("2");
        Map result = new HashMap();
        try {
            promotionSecKillService.processSecKill(psid , userid , 1);
            String orderNo = promotionSecKillService.sendOrderToQueue(userid);
            Map data = new HashMap();
            data.put("orderNo", orderNo);
            result.put("code", "0");
            result.put("message", "success");
            result.put("data", data);
        } catch (SecKillException e) {
            result.put("code", "500");
            result.put("message", e.getMessage());
        }
        return result;
    }
    @RequestMapping("/dir_seckill")
    @ResponseBody
    public Map direct_processSecKill(Long psid , String userid){
        String[] names = applicationContext.getBeanNamesForType(SecKillController.class);
        System.out.println( "direct :SecKillController name:"+Arrays.toString(names));
        System.out.println("current thread"+Thread.currentThread().getName());
        // System.out.println("psid"+psid);
        psid=Long.parseLong("2");
        Map result = new HashMap();
        try {
          String orderNo=  promotionSecKillService.direct_processSecKill(psid , userid , 1);

            Map data = new HashMap();
            data.put("orderNo", orderNo);
            result.put("code", "0");
            result.put("message", "success");
            result.put("data", data);
        } catch (SecKillException e) {
            result.put("code", "500");
            result.put("message", e.getMessage());
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return result;
    }
    @GetMapping("/checkorder")
    public ModelAndView checkOrder(String orderNo){
        Order order =  promotionSecKillService.checkOrder(orderNo);
        ModelAndView mav = new ModelAndView();
        if(order != null){
            mav.addObject("order", order);
            mav.setViewName("order");
        }else{
            mav.addObject("orderNo", orderNo);
            mav.setViewName("waiting");
        }
        return mav;
    }
}
