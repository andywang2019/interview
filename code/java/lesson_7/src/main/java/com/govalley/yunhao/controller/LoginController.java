package com.govalley.yunhao.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/user")
public class LoginController {

    // 登录页面 (GET)
    @GetMapping("/login")
    public String loginPage() {
        return "login"; // 返回 login.html (模板引擎视图)
    }

    // 登录接口 (POST)
    @PostMapping("/login")
    @ResponseBody
    public String login(@RequestParam String username,
                        @RequestParam String password,
                        HttpSession session) {

        // 模拟验证逻辑（实际应查数据库）
        if ("admin".equals(username) && "123456".equals(password)) {
            // 登录成功 -> 将用户信息放入 Session
            session.setAttribute("user", username);
            return "✅ 登录成功，SessionID: " + session.getId();
        } else {
            return "❌ 用户名或密码错误";
        }
    }

    // 获取当前登录用户信息
    @GetMapping("/info")
    @ResponseBody
    public String userInfo(HttpSession session) {
        Object user = session.getAttribute("user");
        if (user == null) {
            return "⚠️ 用户未登录";
        }
        return "当前登录用户：" + user + "，SessionID: " + session.getId();
    }

    // 退出登录
    @GetMapping("/logout")
    @ResponseBody
    public String logout(HttpSession session) {
        session.invalidate(); // 立即销毁 Session
        return "👋 已退出登录";
    }
}
