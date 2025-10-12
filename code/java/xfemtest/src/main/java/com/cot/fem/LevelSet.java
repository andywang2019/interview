package com.cot.fem;
/**
 * LevelSet - 水平集函数类
 * 用于描述裂纹几何形状
 */
public class LevelSet {
    private double[] crackStart; // 裂纹起点
    private double[] crackEnd;   // 裂纹终点
    private double[] crackTip;   // 裂纹尖端
    
    public LevelSet(double[] crackStart, double[] crackEnd) {
        this.crackStart = crackStart;
        this.crackEnd = crackEnd;
        this.crackTip = crackEnd; // 假设裂纹尖端在终点
    }
    
    /**
     * 计算有符号距离函数 (到裂纹面的距离)
     * @param x 点坐标
     * @return 有符号距离
     */
    public double signedDistance(double[] x) {
        // 计算点到裂纹线段的有符号距离
        double[] v = {crackEnd[0] - crackStart[0], crackEnd[1] - crackStart[1]};
        double[] w = {x[0] - crackStart[0], x[1] - crackStart[1]};
        
        double c1 = dot(w, v);
        if (c1 <= 0) {
            return distance(x, crackStart);
        }
        
        double c2 = dot(v, v);
        if (c1 >= c2) {
            return distance(x, crackEnd);
        }
        
        double b = c1 / c2;
        double[] pb = {crackStart[0] + b * v[0], crackStart[1] + b * v[1]};
        
        // 计算有符号距离（使用叉积判断符号）
        double cross = (crackEnd[0] - crackStart[0]) * (x[1] - crackStart[1]) 
                     - (crackEnd[1] - crackStart[1]) * (x[0] - crackStart[0]);
        double dist = distance(x, pb);
        return cross >= 0 ? dist : -dist;
    }
    
    /**
     * 计算到裂纹尖端的距离
     */
    public double distanceToTip(double[] x) {
        return distance(x, crackTip);
    }
    
    /**
     * 计算裂纹尖端的极角
     */
    public double angleFromTip(double[] x) {
        double[] crackDir = normalize(new double[]{
            crackEnd[0] - crackStart[0],
            crackEnd[1] - crackStart[1]
        });
        
        double[] toPoint = {x[0] - crackTip[0], x[1] - crackTip[1]};
        double[] normalizedToPoint = normalize(toPoint);
        
        double angle = Math.atan2(normalizedToPoint[1], normalizedToPoint[0]) 
                     - Math.atan2(crackDir[1], crackDir[0]);
        
        // 归一化到 [-π, π]
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle < -Math.PI) angle += 2 * Math.PI;
        
        return angle;
    }
    
    /**
     * 判断节点是否被裂纹切割
     */
    public boolean isCut(double[][] elementNodes) {
        boolean hasPositive = false;
        boolean hasNegative = false;
        
        for (double[] node : elementNodes) {
            double phi = signedDistance(node);
            if (phi > 1e-10) hasPositive = true;
            if (phi < -1e-10) hasNegative = true;
        }
        
        return hasPositive && hasNegative;
    }
    
    /**
     * 判断节点是否在裂纹尖端附近
     */
    public boolean isNearTip(double[] x, double radius) {
        return distanceToTip(x) < radius;
    }
    
    // 辅助方法
    private double dot(double[] a, double[] b) {
        return a[0] * b[0] + a[1] * b[1];
    }
    
    private double distance(double[] a, double[] b) {
        double dx = a[0] - b[0];
        double dy = a[1] - b[1];
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    private double[] normalize(double[] v) {
        double len = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        if (len < 1e-10) return new double[]{1, 0};
        return new double[]{v[0] / len, v[1] / len};
    }
    
    // Getters
    public double[] getCrackStart() { return crackStart; }
    public double[] getCrackEnd() { return crackEnd; }
    public double[] getCrackTip() { return crackTip; }
}