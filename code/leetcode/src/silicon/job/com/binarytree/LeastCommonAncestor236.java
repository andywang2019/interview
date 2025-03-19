package silicon.job.com.binarytree;



import silicon.job.com.common.TreeNode;

import java.util.ArrayList;
import java.util.List;

public class LeastCommonAncestor236 {

    //method1
    public static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {


        if (root == null || root.val == q.val || root.val == p.val) {
            return root;
        }
        TreeNode l = lowestCommonAncestor(root.left, p, q);
        TreeNode r = lowestCommonAncestor(root.right, p, q);
        if (l != null && r != null)
            return root;

        return l != null ? l : r;
    }
    //method 2

    public static void lowestCommonAncestorMethod2( TreeNode root, TreeNode p, TreeNode q){
        List<String> res=new ArrayList<>();
        StringBuffer sb=new StringBuffer();
        lowestCommonAncestorPath(res,root,p,q, sb);
        System.out.print(res);
    }
    public static void lowestCommonAncestorPath(List<String> tmp, TreeNode root, TreeNode p, TreeNode q, StringBuffer sb){

        if (root == null )
            return;
        if (root.val == q.val || root.val == p.val) {
            tmp.add(sb.toString());
            return ;
        }
        sb.append(root.val);
        lowestCommonAncestorPath(tmp,root.left, p, q,sb);
        lowestCommonAncestorPath(tmp,root.right, p, q,sb);
        sb.deleteCharAt(sb.length()-1);
    }
    public static void main(String[] args) {
        TreeNode n7=new TreeNode(7);
        TreeNode  n8=new TreeNode(8);
        TreeNode  n5=new TreeNode(5);
        TreeNode n4=new TreeNode(4);
        TreeNode n2=new TreeNode(2,n7,n5);
        TreeNode  n6=new TreeNode(6,n4,n8);
        TreeNode n3=new TreeNode(3,null,n6);
        TreeNode  n1=new TreeNode(1,n2,n3);
        System.out.print(lowestCommonAncestor(n1,n7,n8).val);
        //  lowestCommonAncestorMethod2(n1,n7,n8);
    }
}
