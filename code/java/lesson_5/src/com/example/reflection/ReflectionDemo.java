package com.example.reflection;

import java.lang.reflect.*;



/*

┌──────────────────────────────┐
│  方法区（Method Area）       │ ← 存放类元数据、常量池、静态变量等
│   ├─ 类信息（字段/方法表）   │
│   ├─ 运行时常量池            │ ← ★ 就在这里！
│   └─ 静态变量
      Test(Test.casss)│<----------------------------class
├──────────────────────────────┤
│  堆（Heap）                │ ← 存放对象实例
├──────────────────────────────┤
│  Java 虚拟机栈（JVM Stack） │ ← 每个线程独立，存放局部变量、操作数栈
├──────────────────────────────┤
│  本地方法栈（Native Stack） │ ← 调用 C/C++ native 方法用
├──────────────────────────────┤
│  程序计数器（PC）           │ ← 当前线程执行的字节码行号
└──────────────────────────────┘

*/

class Test{

    static int a=0;
    static void test(){

    }
     void fun(){

    }
}
public class ReflectionDemo {

    
    public static void main(String[] args) throws Exception {
        Test t=new Test(); //classload(.class)-> Class  class->Test
       System.out.println( Test.a);
        Test.test();
        t.fun();
        // 1. 获取Class对象的三种方式
        Class<?> clazz1 = Class.forName("com.example.reflection.User");
        Class<?> clazz2 = User.class;
        Class<?> clazz3 = new User().getClass();
        
        System.out.println("=== 反射机制演示 ===\n");
        
        // 2. 获取类的信息
        System.out.println("类名: " + clazz1.getName());
        System.out.println("简单类名: " + clazz1.getSimpleName());
        
        // 3. 获取所有方法
        System.out.println("\n方法列表:");
        Method[] methods = clazz1.getDeclaredMethods();
        for (Method method : methods) {
            System.out.println("  - " + method.getName());
        }
        
        // 4. 获取所有字段
        System.out.println("\n字段列表:");
        Field[] fields = clazz1.getDeclaredFields();
        for (Field field : fields) {
            System.out.println("  - " + field.getName() + " (" + field.getType().getSimpleName() + ")");
        }
        
        // 5. 创建对象实例
        Object obj = clazz1.getDeclaredConstructor().newInstance();
        
        // 6. 调用方法
        System.out.println("\n调用方法:");
      Method setNameMethod = clazz1.getMethod("setName", String.class);
        setNameMethod.invoke(obj, "张三");



       // ((User)obj).setName("zhangs");
        
        Method getNameMethod = clazz1.getMethod("getName");
        String name = (String) getNameMethod.invoke(obj);
        System.out.println("  getName() 返回: " + name);
        
        // 7. 访问私有字段
        System.out.println("\n访问私有字段:");
        Field nameField = clazz1.getDeclaredField("name");
        nameField.setAccessible(true); // 突破private限制
        nameField.set(obj, "李四");
        System.out.println("  直接设置字段值: " + nameField.get(obj));
    }
}

class User {
    private String name;
    private int age;
    
    public User() {
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
    public void setAge(int age) {
        this.age = age;
    }
    
    public int getAge() {
        return age;
    }
}
