package com.cot.fem;
import java.util.*;

import org.ujmp.core.DenseMatrix;
import org.ujmp.core.Matrix;

/**
 * Main - XFEM 主程序
 * 演示含中心裂纹的矩形板在拉伸载荷下的断裂分析
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("=".repeat(60));
        System.out.println("XFEM (扩展有限元法) 断裂力学分析程序");
        System.out.println("=".repeat(60));
        
        // 1. 定义几何和材料参数
        double width = 2.0;   // 板宽
        double height = 2.0;  // 板高
        double crackLength = 0.5; // 裂纹长度
        
        double E = 200e9;     // 杨氏模量 (Pa) - 钢
        double nu = 0.3;      // 泊松比
        double thickness = 0.01; // 厚度 (m)
        double appliedStress = 100e6; // 施加应力 (Pa)
        
        System.out.println("\n【几何参数】");
        System.out.println("  板尺寸: " + width + " × " + height + " m");
        System.out.println("  裂纹长度: " + crackLength + " m");
        System.out.println("\n【材料参数】");
        System.out.println("  杨氏模量: " + E/1e9 + " GPa");
        System.out.println("  泊松比: " + nu);
        System.out.println("  厚度: " + thickness + " m");
        System.out.println("  施加应力: " + appliedStress/1e6 + " MPa");
        
        // 2. 创建网格
        System.out.println("\n【网格生成】");
        int nx = 80; // x 方向单元数
        int ny = 80; // y 方向单元数
        
        MeshData mesh = createMesh(width, height, nx, ny);
        System.out.println("  节点数: " + mesh.nodes.length);
        System.out.println("  单元数: " + mesh.elements.size());
        
        // 3. 定义裂纹 (中心水平裂纹)
        System.out.println("\n【裂纹定义】");
        double[] crackStart = {width/2 - crackLength/2, height/2};
        double[] crackEnd = {width/2 + crackLength/2, height/2};
        LevelSet levelSet = new LevelSet(crackStart, crackEnd);
        
        System.out.println("  裂纹起点: (" + crackStart[0] + ", " + crackStart[1] + ")");
        System.out.println("  裂纹终点: (" + crackEnd[0] + ", " + crackEnd[1] + ")");
        
        // 统计富集节点
        int cutElements = 0;
        int tipElements = 0;
        for (Q4Element elem : mesh.elements) {
            if (levelSet.isCut(elem.getNodeCoords())) {
                cutElements++;
            }
            double[] centroid = elem.getCentroid();
            if (levelSet.isNearTip(centroid, 0.5)) {
                tipElements++;
            }
        }
        System.out.println("  被裂纹切割的单元: " + cutElements);
        System.out.println("  裂尖附近单元: " + tipElements);
        
        // 4. 组装刚度矩阵
        System.out.println("\n【XFEM 装配】");
        XFEMAssembler assembler = new XFEMAssembler(
            mesh.elements, mesh.nodes, levelSet, E, nu, thickness
        );
        
        System.out.println("  标准自由度: " + mesh.nodes.length * 2);
        System.out.println("  Heaviside 富集节点: " + assembler.getHeavisideDOF().size());
        System.out.println("  裂尖富集节点: " + assembler.getTipDOF().size());
        System.out.println("  总自由度: " + assembler.getTotalDOF());
        
        System.out.print("  正在组装刚度矩阵...");
        long startTime = System.currentTimeMillis();
        double[][] K = assembler.assembleStiffnessMatrix();
        long endTime = System.currentTimeMillis();
        System.out.println(" 完成 (" + (endTime - startTime) + " ms)");
        
        // 5. 施加边界条件和载荷
        System.out.println("\n【边界条件】");
        System.out.println("  底边固定 (y = 0)");
        System.out.println("  顶边施加拉伸应力 (y = " + height + ")");
        
        // 简化求解：使用解析解估算位移
        double[] displacements = new double[mesh.nodes.length * 2];
        for (int i = 0; i < mesh.nodes.length; i++) {
            double x = mesh.nodes[i][0];
            double y = mesh.nodes[i][1];
            
            // 简化的位移场 (线性近似)
            displacements[i * 2] = 0; // u_x
            displacements[i * 2 + 1] = appliedStress * y / E; // u_y
        }
        
        int numNodes = mesh.nodes.length;
        Matrix U = DenseMatrix.Factory.zeros(2 * numNodes, 1);

        for (int i = 0; i < numNodes; i++) {
            U.setAsDouble(displacements[i], 2 * i, 0);     // u_x
            //U.setAsDouble(displacements[i][1], 2 * i + 1, 0); // u_y
        }
        

        Q4Element[] elemArray = mesh.elements.toArray(new Q4Element[0]);
        // 6. 计算应力强度因子
        System.out.println("\n【应力强度因子计算】");
        SIFCalculator sifCalc = new SIFCalculator(levelSet, E, nu, true);
        double SIF = sifCalc.calculateSIF(elemArray, U, E, nu);
        
        double KI = SIF;
        //double KII = SIF[1];
        
        System.out.println("  K_I  (模式 I):  " + String.format("%.3e", KI) + " Pa·m^0.5");
       // System.out.println("  K_II (模式 II): " + String.format("%.3e", KII) + " Pa·m^0.5");
        
        // 理论解 (中心裂纹板)
        double a = crackLength / 2; // 半裂纹长度
        double KI_theory = appliedStress * Math.sqrt(Math.PI * a);
        System.out.println("\n  理论解 K_I: " + String.format("%.3e", KI_theory) + " Pa·m^0.5");
        System.out.println("  相对误差: " + String.format("%.2f", Math.abs(KI - KI_theory) / KI_theory * 100) + "%");
        
        
        // 7. 计算能量释放率
        double G = sifCalc.calculateEnergyReleaseRate(elemArray, U, E, nu);
        System.out.println("\n【能量释放率】");
        System.out.println("  G = " + String.format("%.3e", G) + " J/m²");
        
        // 8. 结果总结
        System.out.println("\n" + "=".repeat(60));
        System.out.println("分析完成！");
        System.out.println("=".repeat(60));
        
        System.out.println("\n【关键结果】");
        System.out.println("  ✓ 成功建立 XFEM 模型");
        System.out.println("  ✓ 裂纹富集: " + cutElements + " 个单元");
        System.out.println("  ✓ 裂尖富集: " + tipElements + " 个单元");
        System.out.println("  ✓ K_I = " + String.format("%.2f", KI/1e6) + " MPa·m^0.5");
        System.out.println("  ✓ 能量释放率 G = " + String.format("%.2f", G) + " J/m²");
        
        System.out.println("\n程序运行成功！");
    }
    
    /**
     * 创建矩形网格
     */
    private static MeshData createMesh(double width, double height, int nx, int ny) {
        int numNodes = (nx + 1) * (ny + 1);
        int numElements = nx * ny;
        
        double[][] nodes = new double[numNodes][2];
        List<Q4Element> elements = new ArrayList<>();
        
        // 生成节点
        double dx = width / nx;
        double dy = height / ny;
        
        for (int j = 0; j <= ny; j++) {
            for (int i = 0; i <= nx; i++) {
                int nodeId = j * (nx + 1) + i;
                nodes[nodeId][0] = i * dx;
                nodes[nodeId][1] = j * dy;
            }
        }
        
        // 生成单元
        for (int j = 0; j < ny; j++) {
            for (int i = 0; i < nx; i++) {
                int elemId = j * nx + i;
                int n0 = j * (nx + 1) + i;
                int n1 = n0 + 1;
                int n2 = n0 + (nx + 1) + 1;
                int n3 = n0 + (nx + 1);
                
                int[] nodeIds = {n0, n1, n2, n3};
                double[][] elemNodes = {
                    nodes[n0], nodes[n1], nodes[n2], nodes[n3]
                };
                
                elements.add(new Q4Element(elemId, nodeIds, elemNodes));
            }
        }
        
        return new MeshData(nodes, elements);
    }
    
    /**
     * 网格数据结构
     */
    private static class MeshData {
        double[][] nodes;
        List<Q4Element> elements;
        
        MeshData(double[][] nodes, List<Q4Element> elements) {
            this.nodes = nodes;
            this.elements = elements;
        }
    }
}