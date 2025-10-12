package com.cot.fem;

import org.ujmp.core.Matrix;
import org.ujmp.core.DenseMatrix;

/**
 * Q4Element：四节点等参单元（四边形）
 * 对应 XFEM 裂纹分析中的基础单元。
 */
public class Q4Element {
    public final Node[] nodes;           // 单元的 4 个节点
    public EnrichType[] enrichType;       // 每个节点的富集类型
    public Matrix Ke;                     // 单元刚度矩阵（8×8）

    public Q4Element(Node[] nodes) {
        if (nodes.length != 4) {
            throw new IllegalArgumentException("Q4Element 必须有 4 个节点");
        }
        this.nodes = nodes;
        this.enrichType = new EnrichType[4];
        for (int i = 0; i < 4; i++) enrichType[i] = EnrichType.NONE;
        this.Ke = DenseMatrix.Factory.zeros(8, 8);
    }
    public Q4Element(int id, int[] nodeIds, double[][] coords) {
        if (nodeIds.length != 4 || coords.length != 4) {
            throw new IllegalArgumentException("Q4Element 必须 4 个节点");
        }
        this.nodes = new Node[4];
        for (int i = 0; i < 4; i++) {
            this.nodes[i] = new Node(nodeIds[i], coords[i][0], coords[i][1]);
        }
        this.enrichType = new EnrichType[4];
        for (int i = 0; i < 4; i++) enrichType[i] = EnrichType.NONE;
        this.Ke = DenseMatrix.Factory.zeros(8, 8);
    }


    public Node[] getNodes() {
        return nodes;
    }

    public Node getNode(int i) {
        return nodes[i];
    }
    
    

    /** 获取节点 ID 数组 */
    public int[] getNodeIds() {
        int[] ids = new int[4];
        for (int i = 0; i < 4; i++) ids[i] = nodes[i].getId();
        return ids;
    }

    /** 获取节点坐标数组 (4×2) */
    public double[][] getNodeCoords() {
        double[][] coords = new double[4][2];
        for (int i = 0; i < 4; i++) {
            coords[i][0] = nodes[i].getX();
            coords[i][1] = nodes[i].getY();
        }
        return coords;
    }

    /** 获取形心坐标 */
    public double[] getCentroid() {
        double cx = 0, cy = 0;
        for (Node n : nodes) {
            cx += n.getX();
            cy += n.getY();
        }
        return new double[]{ cx / 4.0, cy / 4.0 };
    }

    /** 映射自然坐标到物理坐标 */
    public double[] mapToGlobal(double xi, double eta) {
        double[] N = shapeFunction(xi, eta);
        double x = 0, y = 0;
        for (int i = 0; i < 4; i++) {
            x += N[i] * nodes[i].getX();
            y += N[i] * nodes[i].getY();
        }
        return new double[]{ x, y };
    }

    /** 计算 Jacobian 矩阵 */
    public double[][] getJacobian(double xi, double eta) {
        double[][] dN = getShapeDerivatives(xi, eta);
        double J00 = 0, J01 = 0, J10 = 0, J11 = 0;
        for (int i = 0; i < 4; i++) {
            J00 += dN[i][0] * nodes[i].getX();
            J01 += dN[i][0] * nodes[i].getY();
            J10 += dN[i][1] * nodes[i].getX();
            J11 += dN[i][1] * nodes[i].getY();
        }
        return new double[][] { {J00, J01}, {J10, J11} };
    }

    /** Jacobian 行列式 */
    public double getJacobianDeterminant(double xi, double eta) {
        double[][] J = getJacobian(xi, eta);
        return J[0][0] * J[1][1] - J[0][1] * J[1][0];
    }

   

    /** 对自然坐标的导数 dN/dxi, dN/deta */
    public double[][] getShapeDerivatives(double xi, double eta) {
        return new double[][]{
                { -0.25 * (1 - eta), -0.25 * (1 - xi) },
                {  0.25 * (1 - eta), -0.25 * (1 + xi) },
                {  0.25 * (1 + eta),  0.25 * (1 + xi) },
                { -0.25 * (1 + eta),  0.25 * (1 - xi) }
        };
    }

    // ====== Q4 形函数 ======
    public double[] shapeFunction(double xi, double eta) {
        return new double[]{
                0.25 * (1 - xi) * (1 - eta),
                0.25 * (1 + xi) * (1 - eta),
                0.25 * (1 + xi) * (1 + eta),
                0.25 * (1 - xi) * (1 + eta)
        };
    }

    // ====== 形函数对自然坐标的导数 ======
    public double[][] dN_dXi(double xi, double eta) {
        return new double[][]{
                { -0.25 * (1 - eta), -0.25 * (1 - xi) },
                {  0.25 * (1 - eta), -0.25 * (1 + xi) },
                {  0.25 * (1 + eta),  0.25 * (1 + xi) },
                { -0.25 * (1 + eta),  0.25 * (1 - xi) }
        };
    }

    // ====== 打印调试信息 ======
    @Override
    public String toString() {
        return "Q4Element{ nodes=" + nodes[0].getId() + "," + nodes[1].getId() + "," +
                nodes[2].getId() + "," + nodes[3].getId() + " }";
    }
}
