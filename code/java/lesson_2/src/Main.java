public class Main {
    public static void main(String[] args) {


        //while (true) {
            String ss = "hello";

        String str = new String("hello");
        String str2=str.replace('l','k');
        System.out.println(str2);
        System.out.println(str2==str);
            StringBuffer s2 = new StringBuffer("hello");

            fun(s2);
            System.out.println(s2);
            int a=10;
            fun2(a);

            System.out.println(a);
        System.out.println(Thread.currentThread().getName());
      //  }
    }


    //pass by reference
    public static void fun(StringBuffer ss){
         ss.append("world");
    }
    //pass by value : int float,
    public static void fun2(int a){
        a=a+2;
        System.out.println(a);
    }


}