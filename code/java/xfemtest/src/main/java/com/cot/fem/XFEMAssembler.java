package com.cot.fem;
import java.util.*;

/**
 * XFEMAssembler - XFEM 刚度矩阵装配器
 * 组装全局刚度矩阵和载荷向量
 */
public class XFEMAssembler {
    private List<Q4Element> elements;
    private double[][] nodes;
    private LevelSet levelSet;
    private EnrichmentFunction enrichment;
    private double E; // 杨氏模量
    private double nu; // 泊松比
    private double thickness; // 厚度（平面应力）
    private double enrichmentRadius; // 裂尖富集半径
    
    private int totalDOF;
    private Map<Integer, Integer> standardDOF; // 标准自由度映射
    private Map<Integer, Integer> heavisideDOF; // Heaviside 富集自由度
    private Map<Integer, Integer> tipDOF; // 裂尖富集自由度
    
    public XFEMAssembler(List<Q4Element> elements, double[][] nodes, 
                         LevelSet levelSet, double E, double nu, double thickness) {
        this.elements = elements;
        this.nodes = nodes;
        this.levelSet = levelSet;
        this.enrichment = new EnrichmentFunction(levelSet);
        this.E = E;
        this.nu = nu;
        this.thickness = thickness;
        this.enrichmentRadius = 0.5; // 默认富集半径
        
        this.standardDOF = new HashMap<>();
        this.heavisideDOF = new HashMap<>();
        this.tipDOF = new HashMap<>();
        
        setupDOF();
    }
    
    /**
     * 设置自由度编号
     */
    private void setupDOF() {
        int dofCounter = 0;
        
        // 标准自由度 (每个节点 2 个 DOF: x, y)
        for (int i = 0; i < nodes.length; i++) {
            standardDOF.put(i, dofCounter);
            dofCounter += 2;
        }
        
        // Heaviside 富集自由度
        for (int i = 0; i < nodes.length; i++) {
            boolean needsEnrichment = false;
            for (Q4Element elem : elements) {
                if (containsNode(elem, i) && levelSet.isCut(elem.getNodeCoords())) {
                    needsEnrichment = true;
                    break;
                }
            }
            if (needsEnrichment) {
                heavisideDOF.put(i, dofCounter);
                dofCounter += 2;
            }
        }
        
        // 裂尖富集自由度 (4个富集函数 × 2个方向)
        for (int i = 0; i < nodes.length; i++) {
            if (levelSet.isNearTip(nodes[i], enrichmentRadius)) {
                tipDOF.put(i, dofCounter);
                dofCounter += 8; // 4 functions × 2 directions
            }
        }
        
        totalDOF = dofCounter;
    }
    
    /**
     * 组装全局刚度矩阵
     */
    public double[][] assembleStiffnessMatrix() {
        double[][] K = new double[totalDOF][totalDOF];
        
        // 高斯积分点 (2×2)
        double[] gp = {-1.0/Math.sqrt(3), 1.0/Math.sqrt(3)};
        double[] gw = {1.0, 1.0};
        
        for (Q4Element elem : elements) {
            double[][] Ke =computeElementStiffness(elem, E, nu, thickness);// computeElementStiffness(elem, gp, gw);
            assembleElementMatrix(K, Ke, elem);
        }
        
        return K;
    }
    
    /**
     * 计算单元刚度矩阵
     */
    private double[][] computeElementStiffness(Q4Element elem, double E, double nu, double thickness) {
        int numNodes = 4;//elem.getNumNodes();        // Q4 -> 4
        int elemDOF = 2 * numNodes;               // 8 自由度
        double[][] Ke = new double[elemDOF][elemDOF];

        // ✅ 弹性矩阵 D (3×3)
        double[][] D = getElasticityMatrix(E, nu);

        // ✅ 2×2 高斯积分点（标准 Q4）
        double[] gp = {-1.0 / Math.sqrt(3.0), 1.0 / Math.sqrt(3.0)};
        double[] gw = {1.0, 1.0};

        for (int i = 0; i < gp.length; i++) {
            for (int j = 0; j < gp.length; j++) {
                double xi = gp[i];
                double eta = gp[j];
                double w = gw[i] * gw[j];

                // ✅ 全局坐标 & Jacobian
                double[] globalCoord = elem.mapToGlobal(xi, eta);
                double detJ = elem.getJacobianDeterminant(xi, eta);
                if (Math.abs(detJ) < 1e-12) {
                    throw new RuntimeException("Jacobian determinant is zero!");
                }

                // ✅ B 矩阵：3 × 8
                double[][] B = computeBMatrix(elem, xi, eta, globalCoord);

                // ✅ Step 1: Bt = B^T (8 × 3)
                double[][] Bt = new double[elemDOF][3];
                for (int r = 0; r < elemDOF; r++) {
                    for (int c = 0; c < 3; c++) {
                        Bt[r][c] = B[c][r];
                    }
                }

                // ✅ Step 2: BtD = Bt * D (8 × 3)
                double[][] BtD = new double[elemDOF][3];
                for (int r = 0; r < elemDOF; r++) {
                    for (int c = 0; c < 3; c++) {
                        double sum = 0.0;
                        for (int k = 0; k < 3; k++) {
                            sum += Bt[r][k] * D[k][c];
                        }
                        BtD[r][c] = sum;
                    }
                }

                // ✅ Step 3: BtDB = BtD * B (8 × 8)
                double[][] BtDB = new double[elemDOF][elemDOF];
                for (int r = 0; r < elemDOF; r++) {
                    for (int c = 0; c < elemDOF; c++) {
                        double sum = 0.0;
                        for (int k = 0; k < 3; k++) {
                            sum += BtD[r][k] * B[k][c];
                        }
                        BtDB[r][c] = sum;
                    }
                }

                // ✅ Step 4: 累积到单元刚度矩阵
                for (int m = 0; m < elemDOF; m++) {
                    for (int n = 0; n < elemDOF; n++) {
                        Ke[m][n] += BtDB[m][n] * detJ * w * thickness;
                    }
                }
            }
        }

        return Ke;
    }
    private double[][] getElasticityMatrix(double E, double nu) {
        double[][] D = new double[3][3];
        double coeff = E / (1 - nu * nu);

        D[0][0] = coeff;
        D[0][1] = coeff * nu;
        D[0][2] = 0.0;

        D[1][0] = coeff * nu;
        D[1][1] = coeff;
        D[1][2] = 0.0;

        D[2][0] = 0.0;
        D[2][1] = 0.0;
        D[2][2] = coeff * (1 - nu) / 2.0;

        return D;
    }

    private double[][] old_computeElementStiffness(Q4Element elem, double[] gp, double[] gw) {
        int[] nodeIds = elem.getNodeIds();
        int elemDOF = getElementDOF(elem);
        double[][] Ke = new double[elemDOF][elemDOF];
        
        // 弹性矩阵 (平面应力)
        double[][] D = getElasticityMatrix();
        
        // 高斯积分
        for (int i = 0; i < gp.length; i++) {
            for (int j = 0; j < gp.length; j++) {
                double xi = gp[i];
                double eta = gp[j];
                double w = gw[i] * gw[j];
                
                double[] globalCoord = elem.mapToGlobal(xi, eta);
                double detJ = elem.getJacobianDeterminant(xi, eta);
                
                // 计算 B 矩阵 (应变-位移矩阵)
                double[][] B = computeBMatrix(elem, xi, eta, globalCoord);
                
                // Ke += B^T * D * B * detJ * w * thickness
                for (int m = 0; m < elemDOF; m++) {
                    for (int n = 0; n < elemDOF; n++) {
                        double sum = 0;
                        for (int p = 0; p < 3; p++) {
                            for (int q = 0; q < 3; q++) {
                                sum += B[p][m] * D[p][q] * B[q][n];
                            }
                        }
                        Ke[m][n] += sum * detJ * w * thickness;
                    }
                }
            }
        }
        
        return Ke;
    }
    
    /**
     * 计算 B 矩阵 (应变-位移矩阵)
     */
    private double[][] computeBMatrix(Q4Element elem, double xi, double eta, double[] globalCoord) {
        int numNodes = 4; // Q4 元素固定 4 个节点

        // ✅ 1. 获取 dN/dxi, dN/deta
        double[][] dN_dXi = elem.getShapeDerivatives(xi, eta); // [4][2]

        // ✅ 2. 计算 Jacobian 矩阵 [2×2]
        double[][] J = elem.getJacobian(xi, eta);

        // ✅ 3. 求 Jacobian 行列式
        double detJ = elem.getJacobianDeterminant(xi, eta);
        if (Math.abs(detJ) < 1e-12) {
            throw new RuntimeException("Jacobian determinant is zero!");
        }

        // ✅ 4. 求 Jacobian 逆矩阵 [2×2]
        double[][] invJ = new double[2][2];
        invJ[0][0] = J[1][1] / detJ;
        invJ[0][1] = -J[0][1] / detJ;
        invJ[1][0] = -J[1][0] / detJ;
        invJ[1][1] = J[0][0] / detJ;

        // ✅ 5. 计算 dN/dx 和 dN/dy（[4][2]）
        double[][] dNdx = new double[numNodes][2];
        for (int i = 0; i < numNodes; i++) {
            dNdx[i][0] = dN_dXi[i][0] * invJ[0][0] + dN_dXi[i][1] * invJ[1][0]; // dN/dx
            dNdx[i][1] = dN_dXi[i][0] * invJ[0][1] + dN_dXi[i][1] * invJ[1][1]; // dN/dy
        }

        // ✅ 6. 构造 B 矩阵 (3 × 8)
        double[][] B = new double[3][2 * numNodes];
        for (int i = 0; i < numNodes; i++) {
            B[0][2 * i]     = dNdx[i][0];   // ε_xx 部分
            B[0][2 * i + 1] = 0.0;

            B[1][2 * i]     = 0.0;
            B[1][2 * i + 1] = dNdx[i][1];   // ε_yy 部分

            B[2][2 * i]     = dNdx[i][1];   // ε_xy 混合项
            B[2][2 * i + 1] = dNdx[i][0];
        }

        return B;
    }

    private double[][] old_computeBMatrix(Q4Element elem, double xi, double eta, double[] globalCoord) {
        int elemDOF = getElementDOF(elem);
        double[][] B = new double[3][elemDOF]; // 3 strain components
        
        // 获取形函数导数
        double[][] dN = elem.getShapeDerivatives(xi, eta);
        double[][] J = elem.getJacobian(xi, eta);
        double[][] invJ = invertMatrix2x2(J);
        
        // 转换到全局坐标系
        double[][] dN_global = new double[2][4];
        for (int i = 0; i < 4; i++) {
            dN_global[0][i] = invJ[0][0] * dN[0][i] + invJ[0][1] * dN[1][i];
            dN_global[1][i] = invJ[1][0] * dN[0][i] + invJ[1][1] * dN[1][i];
        }
        
        // 标准部分
        int[] nodeIds = elem.getNodeIds();
        for (int i = 0; i < 4; i++) {
            int col = i * 2;
            B[0][col] = dN_global[0][i];     // ε_xx
            B[1][col + 1] = dN_global[1][i]; // ε_yy
            B[2][col] = dN_global[1][i];     // γ_xy
            B[2][col + 1] = dN_global[0][i];
        }
        
        // 富集部分 (简化实现)
        // 实际应用中需要添加 Heaviside 和裂尖富集的贡献
        
        return B;
    }
    
    /**
     * 获取弹性矩阵
     */
    private double[][] getElasticityMatrix() {
        double factor = E / (1 - nu * nu);
        double[][] D = new double[3][3];
        D[0][0] = factor;
        D[0][1] = factor * nu;
        D[1][0] = factor * nu;
        D[1][1] = factor;
        D[2][2] = factor * (1 - nu) / 2;
        return D;
    }
    
    /**
     * 组装单元矩阵到全局矩阵
     */
    private void assembleElementMatrix(double[][] K, double[][] Ke, Q4Element elem) {
        int[] nodeIds = elem.getNodeIds();
        int[] globalDOF = getGlobalDOF(elem);
        
        for (int i = 0; i < globalDOF.length; i++) {
            for (int j = 0; j < globalDOF.length; j++) {
                K[globalDOF[i]][globalDOF[j]] += Ke[i][j];
            }
        }
    }
    
    /**
     * 获取单元的全局自由度编号
     */
    private int[] getGlobalDOF(Q4Element elem) {
        int[] nodeIds = elem.getNodeIds();
        List<Integer> dofList = new ArrayList<>();
        
        for (int nodeId : nodeIds) {
            int stdDOF = standardDOF.get(nodeId);
            dofList.add(stdDOF);
            dofList.add(stdDOF + 1);
            
            if (heavisideDOF.containsKey(nodeId)) {
                int hDOF = heavisideDOF.get(nodeId);
                dofList.add(hDOF);
                dofList.add(hDOF + 1);
            }
            
            if (tipDOF.containsKey(nodeId)) {
                int tDOF = tipDOF.get(nodeId);
                for (int i = 0; i < 8; i++) {
                    dofList.add(tDOF + i);
                }
            }
        }
        
        return dofList.stream().mapToInt(Integer::intValue).toArray();
    }
    
    /**
     * 获取单元自由度数
     */
    private int getElementDOF(Q4Element elem) {
        return getGlobalDOF(elem).length;
    }
    
    // 辅助方法
    private boolean containsNode(Q4Element elem, int nodeId) {
        for (int id : elem.getNodeIds()) {
            if (id == nodeId) return true;
        }
        return false;
    }
    
    private double[][] invertMatrix2x2(double[][] M) {
        double det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
        double[][] inv = new double[2][2];
        inv[0][0] = M[1][1] / det;
        inv[0][1] = -M[0][1] / det;
        inv[1][0] = -M[1][0] / det;
        inv[1][1] = M[0][0] / det;
        return inv;
    }
    
    // Getters
    public int getTotalDOF() { return totalDOF; }
    public Map<Integer, Integer> getStandardDOF() { return standardDOF; }
    public Map<Integer, Integer> getHeavisideDOF() { return heavisideDOF; }
    public Map<Integer, Integer> getTipDOF() { return tipDOF; }
}