
class Counter {
    private int value = 0;
    public synchronized int next() {
        return ++value;
    }
}
public class BufferTest {

    public static void main(String[] args) {
        Buffer buffer = new Buffer();
        Counter counter = new Counter();  // 全局唯一计数器
        // 生产者线程
        Runnable producer = () -> {
            try {
                for (int i = 1; i <= 10; i++) {
                    int item = counter.next(); // 从全局计数器取号
                    buffer.put(item);
                    Thread.sleep(100); // 模拟生产耗时
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };

        // 消费者线程
        Runnable consumer = () -> {
            try {
                for (int i = 1; i <= 10; i++) {
                    buffer.take();
                    Thread.sleep(300); // 模拟消费耗时
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };

        // 启动两个生产者和两个消费者
        new Thread(producer, "生产者A").start();
        new Thread(producer, "生产者B").start();
        new Thread(consumer, "消费者X").start();
        new Thread(consumer, "消费者Y").start();
    }
}
