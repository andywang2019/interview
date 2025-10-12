package com.cot.fem;
/**
 * EnrichmentFunction - 富集函数类
 * 包含 Heaviside 函数和裂尖渐近函数
 */
public class EnrichmentFunction {
    private LevelSet levelSet;
    
    public EnrichmentFunction(LevelSet levelSet) {
        this.levelSet = levelSet;
    }
    
    /**
     * Heaviside 富集函数 (用于裂纹面)
     * H(x) = sign(φ(x))
     */
    public double heaviside(double[] x) {
        double phi = levelSet.signedDistance(x);
        return phi >= 0 ? 1.0 : -1.0;
    }
    
    /**
     * 裂尖富集函数 (4个渐近函数)
     * 基于线弹性断裂力学的渐近解
     */
    public double[] crackTipFunctions(double[] x) {
        double r = levelSet.distanceToTip(x);
        double theta = levelSet.angleFromTip(x);
        
        if (r < 1e-10) {
            return new double[]{0, 0, 0, 0};
        }
        
        double sqrtR = Math.sqrt(r);
        double halfTheta = theta / 2.0;
        
        double[] F = new double[4];
        F[0] = sqrtR * Math.sin(halfTheta);
        F[1] = sqrtR * Math.cos(halfTheta);
        F[2] = sqrtR * Math.sin(halfTheta) * Math.sin(theta);
        F[3] = sqrtR * Math.cos(halfTheta) * Math.sin(theta);
        
        return F;
    }
    
    /**
     * 计算 Heaviside 函数的梯度
     */
    public double[] heavisideGradient(double[] x) {
        // Heaviside 函数在裂纹面上不连续，梯度为 Dirac delta
        // 在数值实现中，我们使用水平集函数的梯度
        double h = 1e-6;
        double[] grad = new double[2];
        
        double phi_x_plus = levelSet.signedDistance(new double[]{x[0] + h, x[1]});
        double phi_x_minus = levelSet.signedDistance(new double[]{x[0] - h, x[1]});
        double phi_y_plus = levelSet.signedDistance(new double[]{x[0], x[1] + h});
        double phi_y_minus = levelSet.signedDistance(new double[]{x[0], x[1] - h});
        
        grad[0] = (phi_x_plus - phi_x_minus) / (2 * h);
        grad[1] = (phi_y_plus - phi_y_minus) / (2 * h);
        
        return grad;
    }
    
    /**
     * 计算裂尖富集函数的梯度
     */
    public double[][] crackTipGradients(double[] x) {
        double h = 1e-6;
        double[][] gradients = new double[4][2];
        
        double[] F_center = crackTipFunctions(x);
        
        for (int i = 0; i < 4; i++) {
            // x 方向导数
            double[] F_x_plus = crackTipFunctions(new double[]{x[0] + h, x[1]});
            double[] F_x_minus = crackTipFunctions(new double[]{x[0] - h, x[1]});
            gradients[i][0] = (F_x_plus[i] - F_x_minus[i]) / (2 * h);
            
            // y 方向导数
            double[] F_y_plus = crackTipFunctions(new double[]{x[0], x[1] + h});
            double[] F_y_minus = crackTipFunctions(new double[]{x[0], x[1] - h});
            gradients[i][1] = (F_y_plus[i] - F_y_minus[i]) / (2 * h);
        }
        
        return gradients;
    }
    
    /**
     * 判断节点是否需要 Heaviside 富集
     */
    public boolean needsHeavisideEnrichment(double[] x, double[][] elementNodes) {
        return levelSet.isCut(elementNodes);
    }
    
    /**
     * 判断节点是否需要裂尖富集
     */
    public boolean needsTipEnrichment(double[] x, double enrichmentRadius) {
        return levelSet.isNearTip(x, enrichmentRadius);
    }
}