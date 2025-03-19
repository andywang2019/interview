package silicon.job.com.binarytree;

import silicon.job.com.common.TreeNode;

import java.util.ArrayList;
import java.util.List;

public class BinaryTreePaths257 {


/*Given the root of a binary tree, return all root-to-leaf paths in any order.

A leaf is a node with no children.



Example 1:


Input: root = [1,2,3,null,5]
Output: ["1->2->5","1->3"]
Example 2:

Input: root = [1]
Output: ["1"]
*/

    public static List<List<Integer>> binaryTreePaths(TreeNode root){
        List<Integer> tmp=new ArrayList<Integer>();
        List<List<Integer>> res=new ArrayList<List<Integer>>();

        dfs(root,res,tmp);
        return res;
    }
    public static void dfs(TreeNode root,List<List<Integer>> res, List<Integer> tmp) {
        if (root == null ) {
            return;
        }

        tmp.add(root.val);
            if (root.left == null && root.right == null)
        {       res.add(new ArrayList<>(tmp));

       }


        dfs(root.left,res,tmp);
        dfs(root.right,res,tmp);
        tmp.remove(tmp.size()-1);



    }



}