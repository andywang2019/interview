import silicon.job.com.common.TreeNode;

import java.util.List;

import static silicon.job.com.binarytree.BinaryTreePaths257.binaryTreePaths;
import static silicon.job.com.binarytree.LeastCommonAncestor236.lowestCommonAncestor;
import static silicon.job.com.binarytree.PathSum112.hasPathSum;

public class Main {
    public static void main(String[] args) {

            TreeNode root=new TreeNode(3);
            TreeNode node1=new TreeNode(5);
            TreeNode node2=new TreeNode(1);
            TreeNode node3=new TreeNode(6);
            TreeNode node4=new TreeNode(2);
            root.left=node1;
            root.right=node2;
            node1.left=node3;
            node1.right=node4;

        TreeNode node5=new TreeNode(7);
        TreeNode node6=new TreeNode(8);
        node4.left=node5;
        node4.right=node6;

 //leetcode257
        List<List<Integer>> res=    binaryTreePaths(root);
        System.out.println(res);

        System.out.println(hasPathSum(root,80));
//leetcode 236
        System.out.print(lowestCommonAncestor(root,node2,node4).val);

    }
}