// SIFCalculator.java 直接替换
package com.cot.fem;

import org.ujmp.core.Matrix;
import org.ujmp.core.DenseMatrix;

public class SIFCalculator {

	 private LevelSet levelSet;
	    private double xTip, yTip;
	    private boolean planeStrain;
    // ✅ 新增兼容旧版的构造函数
    public SIFCalculator(LevelSet levelSet, double xTip, double yTip, boolean planeStrain) {
        this.levelSet = levelSet;
        this.xTip = xTip;
        this.yTip = yTip;
        this.planeStrain = planeStrain;
    }

   
    // ✅ 静态 KI 计算函数
    public static double computeKI(double J, double E, double nu, boolean planeStrain) {
        double Eeff = planeStrain ? E / (1 - nu * nu) : E;
        return Math.sqrt(J * Eeff);
    }
    // 主入口：先算 J，再换算 K_I
    public static double computeKI_DomainIntegral(
            Q4Element[] elements, Matrix U, double xTip, double yTip,
            double E, double nu, boolean planeStrain) {

        double J = computeJ_DomainIntegral(elements, U, xTip, yTip, E, nu);
        double Eeff = planeStrain ? E / (1 - nu * nu) : E;
        return Math.sqrt(Math.max(J, 0.0) * Eeff); // 负数容错
    }

    // ===== 域积分（J-Integral, domain form）=====
    public static double computeJ_DomainIntegral(
            Q4Element[] elements, Matrix U,
            double xTip, double yTip, double E, double nu) {

        Matrix D = elasticityMatrix(E, nu);
        double rin = 0.10;  // 内半径（网格单位）
        double rout = 0.35; // 外半径（网格单位）

        // 2×2 Gauss
        double[] gp = { -1.0 / Math.sqrt(3), 1.0 / Math.sqrt(3) };
        double Jsum = 0.0;

        for (Q4Element elem : elements) {
            // 粗筛：元素中心离裂尖太远就跳过
            double cx = 0, cy = 0;
            for (Node n : elem.nodes) { cx += n.x; cy += n.y; }
            cx *= 0.25; cy *= 0.25;
            double rc = Math.hypot(cx - xTip, cy - yTip);
            if (rc > rout * 1.5) continue; // 稍宽松

            for (double xi : gp) for (double eta : gp) {
                // 形函数与导数（自然坐标）
                double[] N = elem.shapeFunction(xi, eta);
                double[][] dN = elem.dN_dXi(xi, eta);

                // Jacobian & 物理坐标
                double J00=0, J01=0, J10=0, J11=0, x=0, y=0;
                for (int i=0;i<4;i++) {
                    J00 += dN[i][0]*elem.nodes[i].x;
                    J01 += dN[i][0]*elem.nodes[i].y;
                    J10 += dN[i][1]*elem.nodes[i].x;
                    J11 += dN[i][1]*elem.nodes[i].y;
                    x   += N[i]*elem.nodes[i].x;
                    y   += N[i]*elem.nodes[i].y;
                }
                double detJ = J00*J11 - J01*J10;
                if (detJ <= 0) continue;

                // dN/dx
                double invJ00 =  J11/detJ, invJ01 = -J01/detJ;
                double invJ10 = -J10/detJ, invJ11 =  J00/detJ;

                // B 矩阵
                Matrix B = DenseMatrix.Factory.zeros(3, 8);
                for (int i=0;i<4;i++) {
                    double dNdx = invJ00*dN[i][0] + invJ01*dN[i][1];
                    double dNdy = invJ10*dN[i][0] + invJ11*dN[i][1];
                    B.setAsDouble(dNdx, 0, 2*i);
                    B.setAsDouble(dNdy, 1, 2*i+1);
                    B.setAsDouble(dNdy, 2, 2*i);
                    B.setAsDouble(dNdx, 2, 2*i+1);
                }

                // 元素局部位移向量 ue
                Matrix ue = elemLocalU(elem, U); // 8×1

                // 应变 / 应力 / 能量密度
                Matrix strain = B.mtimes(ue);          // 3×1
                Matrix stress = D.mtimes(strain);      // 3×1
                double sx = stress.getAsDouble(0,0);
                double sy = stress.getAsDouble(1,0);
                double txy= stress.getAsDouble(2,0);
                double ex = strain.getAsDouble(0,0);
                double ey = strain.getAsDouble(1,0);
                double gxy= strain.getAsDouble(2,0);
                double W  = 0.5*(sx*ex + sy*ey + txy*gxy);

                // 位移梯度 ∂u/∂x（只需 x 方向）
                // 取 u = Σ N_i * [uix, uiy]
                double dux_dx=0, duy_dx=0;
                for (int i=0;i<4;i++) {
                    double dNdx = invJ00*dN[i][0] + invJ01*dN[i][1];
                    double uix = U.getAsDouble(2*elem.nodes[i].id,   0);
                    double uiy = U.getAsDouble(2*elem.nodes[i].id+1, 0);
                    dux_dx += dNdx * uix;
                    duy_dx += dNdx * uiy;
                }

                // 法向分量（域积分中用 ∂q/∂x 代替曲线法向项）
                // 构造帽形权函数 q(r)：r<=rin→1，r>=rout→0，中间线性
                double r = Math.hypot(x - xTip, y - yTip);
                double q = weightHat(r, rin, rout);
                double dqdr = weightHat_d(r, rin, rout);
                // ∂q/∂x = dq/dr * (x - xTip)/r
                double dqx = (r>1e-12) ? dqdr * (x - xTip)/r : 0.0;

                // J 积分核（x-方向）：
                // J = ∫ (W*δ1j - σij * u_{i,1}) * q_,j dΩ ≈ ∫ (W - σx*u_{,x} - τxy*v_{,x}) * ∂q/∂x dΩ
                double integrand = (W - sx*dux_dx - txy*duy_dx) * dqx;

                // dΩ = detJ * wξ * wη，2×2 Gauss 权重均为1
                Jsum += integrand * detJ;
            }
        }
        return Jsum;
    }

    // ---- utils ----
    private static Matrix elemLocalU(Q4Element e, Matrix U) {
        Matrix ue = DenseMatrix.Factory.zeros(8,1);
        for (int i=0;i<4;i++){
            ue.setAsDouble(U.getAsDouble(2*e.nodes[i].id,0),   2*i);
            ue.setAsDouble(U.getAsDouble(2*e.nodes[i].id+1,0), 2*i+1);
        }
        return ue;
    }

    private static Matrix elasticityMatrix(double E, double nu) {
        Matrix D = DenseMatrix.Factory.zeros(3,3);
        double c = E/(1-nu*nu);
        D.setAsDouble(c,     0,0);
        D.setAsDouble(c*nu,  0,1);
        D.setAsDouble(c*nu,  1,0);
        D.setAsDouble(c,     1,1);
        D.setAsDouble(c*(1-nu)/2.0, 2,2);
        return D;
    }

    private static double weightHat(double r, double rin, double rout){
        if (r<=rin) return 1.0;
        if (r>=rout) return 0.0;
        return (rout - r) / (rout - rin);
    }
    private static double weightHat_d(double r, double rin, double rout){
        if (r<=rin || r>=rout) return 0.0;
        return -1.0/(rout - rin);
    }
    
    /** ✅ 核心：能量释放率 J 积分 */
    public double calculateEnergyReleaseRate(Q4Element[] elements, Matrix U, double E, double nu) {
        double J = 0.0;

        // 遍历所有单元
        for (Q4Element elem : elements) {
            double[][] coords = elem.getNodeCoords();
            int[] nodeIds = elem.getNodeIds();

            // 2×2 高斯积分点
            double[] gp = {-0.5773502692, 0.5773502692};
            double[] w = {1.0, 1.0};

            for (double xi : gp) {
                for (double eta : gp) {
                    double detJ = elem.getJacobianDeterminant(xi, eta);
                    double[][] dNdxi = elem.getShapeDerivatives(xi, eta);
                    double[][] Jmat = elem.getJacobian(xi, eta);

                    // Jacobian 逆
                    double det = detJ;
                    double[][] invJ = {
                            { Jmat[1][1]/det, -Jmat[0][1]/det },
                            { -Jmat[1][0]/det, Jmat[0][0]/det }
                    };

                    // dN/dx
                    double[][] dNdx = new double[4][2];
                    for (int i = 0; i < 4; i++) {
                        dNdx[i][0] = dNdxi[i][0] * invJ[0][0] + dNdxi[i][1] * invJ[1][0];
                        dNdx[i][1] = dNdxi[i][0] * invJ[0][1] + dNdxi[i][1] * invJ[1][1];
                    }

                    // 位移场提取
                    double[] u = new double[8];
                    for (int i = 0; i < 4; i++) {
                        u[2 * i] = U.getAsDouble(2 * nodeIds[i], 0);
                        u[2 * i + 1] = U.getAsDouble(2 * nodeIds[i] + 1, 0);
                    }

                    // 应变矩阵 B (3x8)
                    double[][] B = new double[3][8];
                    for (int i = 0; i < 4; i++) {
                        B[0][2 * i] = dNdx[i][0];
                        B[1][2 * i + 1] = dNdx[i][1];
                        B[2][2 * i] = dNdx[i][1];
                        B[2][2 * i + 1] = dNdx[i][0];
                    }

                    // 材料矩阵 D (3x3)
                    double C = planeStrain ? E / ((1 + nu) * (1 - 2 * nu)) : E / (1 - nu * nu);
                    double[][] D = new double[3][3];
                    if (planeStrain) {
                        D[0][0] = C * (1 - nu);
                        D[0][1] = C * nu;
                        D[1][0] = C * nu;
                        D[1][1] = C * (1 - nu);
                        D[2][2] = C * (0.5 - nu);
                    } else {
                        D[0][0] = C;
                        D[0][1] = C * nu;
                        D[1][0] = C * nu;
                        D[1][1] = C;
                        D[2][2] = C * (1 - nu) / 2.0;
                    }

                    // 应变 ε = B * u
                    double[] strain = new double[3];
                    for (int i = 0; i < 3; i++) {
                        for (int j = 0; j < 8; j++) {
                            strain[i] += B[i][j] * u[j];
                        }
                    }

                    // 应力 σ = D * ε
                    double[] stress = new double[3];
                    for (int i = 0; i < 3; i++) {
                        for (int j = 0; j < 3; j++) {
                            stress[i] += D[i][j] * strain[j];
                        }
                    }

                    // 应变能密度 W = 0.5 * σᵀ * ε
                    double W = 0.0;
                    for (int i = 0; i < 3; i++) {
                        W += 0.5 * stress[i] * strain[i];
                    }

                    // 权函数 ∂q/∂x （简单近似，取 1/r）
                    double[] xy = elem.mapToGlobal(xi, eta);
                    double dx = xy[0] - xTip;
                    double dy = xy[1] - yTip;
                    double r = Math.sqrt(dx * dx + dy * dy);
                    double dqdx = (r > 1e-6) ? dx / (r * r) : 0.0;

                    // 域积分近似 J
                    J += (W - stress[0] * strain[0] - stress[1] * strain[1]) * dqdx * detJ * w[0] * w[1];
                }
            }
        }
        return J;
    }
    /** 应力强度因子 KI */
    public double calculateSIF(Q4Element[] elements, Matrix U, double E, double nu) {
        double J = calculateEnergyReleaseRate(elements, U, E, nu);
        double Eeff = planeStrain ? E / (1 - nu * nu) : E;
        return Math.sqrt(J * Eeff);
    }
}
