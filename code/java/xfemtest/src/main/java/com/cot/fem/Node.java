package com.cot.fem;

/**
 * Node 节点类（Q4 单元的基本组成部分）
 * 每个节点包含 ID、坐标 (x, y) 和可扩展的附加属性。
 */
public class Node {
    public final int id;       // 节点编号（全局唯一）
    public final double x;     // X 坐标
    public final double y;     // Y 坐标

    public Node(int id, double x, double y) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    public int getId() {
        return id;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    // 便于调试时打印节点信息
    @Override
    public String toString() {
        return "Node{" +
                "id=" + id +
                ", x=" + x +
                ", y=" + y +
                '}';
    }
}
