import java.util.HashMap;
import java.util.Hashtable;
import java.util.concurrent.*;

public class ComcurrencyHashMapDemo {
    public static void main(String[] args) throws InterruptedException {
        ConcurrentHashMap<String, Integer> counter = new ConcurrentHashMap<>();
      //  HashMap counter=new HashMap();
       // HashMap<String, Integer> counter=new HashMap();
        Hashtable<String, Integer> counter2 = new Hashtable<>();
        Runnable task = () -> {
            for (int i = 0; i < 10000; i++) {
                counter.merge("requests", 1, Integer::sum); // 原子计数
            }
        };

        ExecutorService pool = Executors.newFixedThreadPool(20);
        for (int i = 0; i < 100; i++) pool.execute(task);
        pool.shutdown();
        pool.awaitTermination(1, TimeUnit.MINUTES);

        System.out.println("最终请求数: " + counter.get("requests")); 
        // 输出 10000
    }
}
